/* eslint-disable */

import {
  Box, Flex, Button, Icon, Progress, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Tag } from '@chakra-ui/react';

import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
//import * as React from 'react';
//import useSSE from 'hooks/requests/useSSE';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { SSEContext } from 'contexts/SSEContext';

import React, { useEffect,useContext, useState } from "react";

const columnHelper = createColumnHelper();

export default function ComplexTable() {

  const data = useContext(SSEContext);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("User Email:", user.primaryEmailAddress.emailAddress);
    } else {
      console.log("User is not logged in");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      const email = user.primaryEmailAddress.emailAddress;
      const apiKey = "h6j5dj4tv54xy7kfa0wpzoqm3be2bbmp"
      try {
        await axios.post('http://localhost:5000/add-random-request', { apiKey });

      } catch (error) {
        console.error('Error adding request:', error);
      }
    } else {
      console.error('User is not logged in');
    }
  };



  const [sorting, setSorting] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');


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
    columnHelper.accessor('flow', {
      id: 'flow',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          FLOW
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Tag variant='solid' colorScheme='teal'>{info.getValue()}</Tag>
        </Flex>
      ),
    }),
    columnHelper.accessor('sent_date', {
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
          {info.getValue()}
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
            <Text color={textColor} fontSize="sm" fontWeight="700"> {info.getValue()} </Text>
        </Flex>
      ),
    }),
  ];
  const table = useReactTable({
    columns,
    data: data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });


  if (!data) {
    return <div>Loading...</div>;
  }
  

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
          Flows
        </Text>
        <Menu />
      </Flex>
      <Box>
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
      </Box>
      
      <form onSubmit={handleSubmit}>
          <Button type="submit" colorScheme="blue">Add Request</Button>
        </form>
    </Card>
  );
}
