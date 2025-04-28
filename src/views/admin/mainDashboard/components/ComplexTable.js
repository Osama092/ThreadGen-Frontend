import { Box, Flex, Button, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Tag } from '@chakra-ui/react';

import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';

import { useUser } from '@clerk/clerk-react';

import React, { useEffect, useState } from "react";

const columnHelper = createColumnHelper();

export default function ComplexTable() {
  const [sorting, setSorting] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [isLoading, setIsLoading] = useState(true);
  
  const user_id = user?.id;

  useEffect(() => {
    if (!user_id) return;
    
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        // Register the user for SSE
        const registerResponse = await fetch('http://localhost:5000/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user_id }),
        });
        
        if (!registerResponse.ok) {
          throw new Error('Failed to register user');
        }
        
        // Fetch historical requests for this user
        const requestsResponse = await fetch(`http://localhost:5000/requests/${user_id}`);
        
        if (!requestsResponse.ok) {
          throw new Error('Failed to fetch requests');
        }
        
        const historicalRequests = await requestsResponse.json();
        setMessages(historicalRequests);
        console.log(`Loaded ${historicalRequests.length} historical requests`);
      } catch (error) {
        console.error('Initialization error:', error);
        setConnectionStatus('Failed to connect');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [user_id]);

  // Subscribe to SSE updates
  useEffect(() => {
    if (!user_id) return;

    const eventSource = new EventSource(`http://localhost:5000/subscribe?user_id=${user_id}`);

    eventSource.onopen = () => {
      setConnectionStatus('Connected ✅');
    };

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newData]);
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setConnectionStatus('Disconnected ❌');
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setConnectionStatus('Disconnected ❌');
    };
  }, [user_id]);

  const columns = [
    columnHelper.accessor('id', {
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
            {info.getValue()}
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
          Thread Name
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
    debugTable: true,
  });

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
        <Menu />
      </Flex>
      <Box>
        {isLoading ? (
          <Text p="25px">Loading Requests...</Text>
        ) : messages.length === 0 ? (
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
        )}
      </Box>
      <Text px="25px" fontSize="sm" color="gray.500">
        Connection Status: {connectionStatus}
      </Text>
    </Card>
  );
}