import { 
  Box, 
  Flex, 
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr, 
  useColorModeValue, 
  Tag,
  Button,
  HStack,
  Spinner
} from '@chakra-ui/react';

import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable 
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';

import { useUser } from '@clerk/clerk-react';
import useSSE from 'hooks/useSSE'; // Import our custom hook

import React, { useState, useEffect } from "react";

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  // Set default sorting to created_at in descending order (newest first)
  const [sorting, setSorting] = useState([
    { id: 'created_at', desc: true }
  ]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { user } = useUser();
  
  const user_id = user?.id;
  
  // Use our custom SSE hook
  const { messages, connectionStatus, isLoading } = useSSE(user_id);

  const columns = [
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
      id: 'thread_name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Flow Name
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Tag variant='solid' colorScheme='teal'>{info.getValue()}</Tag>
        </Flex>
      ),
    }),
    columnHelper.accessor('created_at', {
      id: 'created_at',
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
  ];

  const table = useReactTable({
    columns,
    data: messages,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Show 5 rows per page by default
      },
    },
    debugTable: true,
  });

  // Calculate pagination state
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

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
          <Flex justifyContent="center" alignItems="center" p="25px">
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Flex>
        ) : messages.length === 0 ? (
          <Text p="25px">No requests yet. Waiting for updates...</Text>
        ) : (
          <>
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
                              minW={{ sm: '150px', md: '200px' }}
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
            
            {/* Standardized Pagination Controls */}
            {messages.length > 0 && (
              <Flex justifyContent="space-between" alignItems="center" px="25px" pb="25px">
                <Button
                  onClick={() => table.previousPage()}
                  isDisabled={!hasPrevPage}
                  colorScheme="teal"
                  size="sm"
                  variant="outline"
                >
                  Previous
                </Button>
                <Text fontSize="sm" fontWeight="500">
                  Page {currentPage} of {totalPages || 1}
                </Text>
                <Button
                  onClick={() => table.nextPage()}
                  isDisabled={!hasNextPage}
                  colorScheme="teal"
                  size="sm"
                  variant="outline"
                >
                  Next
                </Button>
              </Flex>
            )}
          </>
        )}
      </Box>
    </Card>
  );
}