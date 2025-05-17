import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Tag, Button } from '@chakra-ui/react';

import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import Card from 'components/card/Card';
import { useUser } from '@clerk/clerk-react';
import useSSE from 'hooks/useSSE'; // Import the external SSE hook
import React, { useState, useMemo } from "react";

const columnHelper = createColumnHelper();

const ComplexTable = React.memo(( {thread_name}) => {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, // Show 5 items per page
  });
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { user } = useUser();
  const userId = user?.id;
  
  // Use the external SSE hook with the current user's ID
  const { messages, connectionStatus, isLoading } = useSSE(userId);

  // Filter data based on user ID - use useMemo to prevent unnecessary re-filtering
  const filteredData = useMemo(() => {
    return Array.isArray(messages) ? 
      messages.filter(row => row.thread_name === thread_name) : [];
  }, [messages, thread_name]);

  const columns = useMemo(() => [
    columnHelper.accessor('_id', {
      id: 'id',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ID
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()?.toString().slice(-8)}
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('thread_name', {
      id: 'thread',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Thread
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Tag variant='solid' colorScheme='teal'>{info.getValue()}</Tag>
        </Flex>
      ),
    }),
    columnHelper.accessor('created_at', {
      id: 'sent_date',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          SENT DATE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {(() => {
            const value = info.getValue();
            const date = new Date(value);
    
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // MM
            const day = date.getDate().toString().padStart(2, '0'); // DD
            const year = date.getFullYear(); // YYYY
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0'); // MM
            const ampm = hours >= 12 ? 'PM' : 'AM';
    
            hours = hours % 12; // Convert to 12-hour format
            hours = hours ? hours : 12; // Handle midnight case (0)
            
            return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
          })()}
        </Text>
      ),
    }),
    columnHelper.accessor('tts_text', {
      id: 'tts_text',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          TTS TEXT
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700"> "{info.getValue()}" </Text>
        </Flex>
      ),
    }),
  ],
  [textColor]);

  const table = useReactTable({
    columns,
    data: filteredData,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false, // Set debug to false to reduce console logs
  });
  
  // Calculate total pages - use useMemo to prevent recalculation on every render
  const { totalPages, currentPage } = useMemo(() => {
    const total = Math.max(1, Math.ceil(filteredData.length / pagination.pageSize));
    const current = pagination.pageIndex + 1; // Adding 1 for human-readable page numbers
    return { totalPages: total, currentPage: current };
  }, [filteredData.length, pagination.pageSize, pagination.pageIndex]);

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Requests
        </Text>
      </Flex>
      <Box>
        {isLoading ? (
          <Text p="25px">Loading Requests...</Text>
        ) : filteredData.length === 0 ? (
          <Text p="25px">No requests yet. Waiting for updates...</Text>
        ) : (
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: '',
                            desc: '',
                          }[header.column.getIsSorted()] ?? null}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table
                .getRowModel()
                .rows
                .map((row) => {
                  return (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td
                            key={cell.id}
                            fontSize={{ sm: '14px' }}
                            minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                            borderColor="transparent"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        )}
      </Box>
      
      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <Flex px="25px" pb="25px" justifyContent="space-between" align="center">
          <Button
            colorScheme="teal"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          
          <Text fontSize="sm" fontWeight="500">
            Page {currentPage} of {totalPages}
          </Text>
          
          <Button
            colorScheme="teal"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </Flex>
      )}
    </Card>
  );
});

export default ComplexTable;