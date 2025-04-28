import React, { useEffect } from 'react';
import { Box, Flex, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useToast, Button } from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import useVisibility from 'hooks/useVisibility';
import useGetUserApiKeys from 'hooks/apiKeys/useGetUserApiKeys'; // Adjust the path as necessary
import { useUser } from '@clerk/clerk-react';

import useAddApiKey from 'hooks/apiKeys/useAddKey';
import useDeleteApiKey from 'hooks/apiKeys/useDeleteKey';

const columnHelper = createColumnHelper();

const ComplexTable = React.memo(() => {
  const { user } = useUser();
  const { keys, loading, error, fetchKeys } = useGetUserApiKeys(user?.id);

  const { createApiKey, loading: createLoading, error: createError, apiKey } = useAddApiKey();
  const { removeApiKey, loading: deleteLoading, error: deleteError, successMessage } = useDeleteApiKey();

  const [sorting, setSorting] = React.useState([]);
  const { visibility, toggleVisibility } = useVisibility();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const handleButtonClick = async () => {
    if (!user?.id) return;  
    await createApiKey(user.id); 
  };

  const handleDeleteApiKey = async (api_key) => {
    await removeApiKey(api_key);
  };

  const columns = [
    columnHelper.accessor('api_key', {
      id: 'api_key',
      header: () => (
        <Text align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          API KEY
        </Text>
      ),
      cell: (info) => {
        const apiKey = info.getValue();
        const id = info.row.id;
        const isVisible = visibility[id];

        // Ensure we don't try to show more characters than exist
        const visibleLength = Math.min(5, apiKey.length);
        const displayKey = isVisible ? apiKey : apiKey.slice(0, visibleLength) + '*'.repeat(Math.max(0, apiKey.length - visibleLength));
        
        const handleDoubleClick = () => {
          navigator.clipboard.writeText(apiKey).then(() => {
            toast({
              title: 'API Key copied.',
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'top-center',
            });
          });
        };
      
        return (
          <Flex alignItems="center" justify="space-between">
            <Text
              color={textColor}
              fontSize="md"
              fontWeight="700"
              onDoubleClick={handleDoubleClick}
            >
              {displayKey}
            </Text>
            <IconButton
              onClick={() => toggleVisibility(id)}
              icon={isVisible ? <MdVisibilityOff /> : <MdVisibility />}
              ml={2}
              size="sm"
              aria-label={isVisible ? 'Hide API Key' : 'Show API Key'}
            />
          </Flex>
        );
      },
    }),

    columnHelper.accessor('created_at', {
      id: 'created_at',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          CREATION DATE
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('nUses', {
      id: 'nUses',
      header: () => (
        <Text justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          N° USES
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
    data: keys,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const handleDelete = async (api_key) => {
    try {
      await handleDeleteApiKey(api_key);
      await fetchKeys();
      toast({
        position: 'top-center',
        title: 'Entry deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        position: 'top-center',
        title: 'Error deleting entry',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddKey = async () => {
    try {
      await handleButtonClick();
      await fetchKeys();
      toast({
        position: 'top-center',
        title: 'New key added successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        position: 'top-center',
        title: 'Error adding new key',
        description: err.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: 'scroll', lg: 'hidden' }}>
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
          Api Keys
        </Text>
        <Button colorScheme='blue' onClick={handleAddKey}>Add Key</Button>
      </Flex>

      <Box data-testid="complex-table">
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr api_key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th api_key={header.id} colSpan={header.colSpan} pe="10px" borderColor={borderColor} cursor="pointer" onClick={header.column.getToggleSortingHandler()}>
                    <Flex justifyContent="space-between" align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: '', desc: '' }[header.column.getIsSorted()] ?? null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign="center">Loading...</Text>
                </Td>
              </Tr>
            ) : error ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign="center" color="red.500">
                    {error.message || 'Failed to load API keys.'}
                  </Text>
                </Td>
              </Tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} fontSize={{ sm: '14px' }} minW={{ sm: '150px', md: '200px', lg: '' }} borderColor="transparent">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                  <Td borderColor="transparent">
                    <Flex justify="flex-end">
                      <Button colorScheme="teal" size="sm" onClick={() => handleDelete(row.original.api_key)}>
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
});

export default ComplexTable;
