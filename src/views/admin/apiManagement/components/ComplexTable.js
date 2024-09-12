import React from 'react';
import { Box, Flex, IconButton, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useToast, Button } from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import useVisibility from 'hooks/useVisibility';
import useGetApiKeys from 'hooks/apiKeys/useGetKeys';
import useDeleteApiKey from 'hooks/apiKeys/useDeleteKey';
import useAddApiKey from 'hooks/apiKeys/useAddKey';

const columnHelper = createColumnHelper();



const ComplexTable = React.memo(() => {
  const { apiKeys, loading: loadingKeys, error: errorKeys, refetch: getApiKeys } = useGetApiKeys();
  const { removeApiKey, loading: loadingDelete, error: errorDelete } = useDeleteApiKey();
  const { addKey, loading: loadingAdd, error: errorAdd } = useAddApiKey();

  const [sorting, setSorting] = React.useState([]);
  const { visibility, toggleVisibility } = useVisibility(); // Use custom hook for visibility
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');


  console.log('apiKeys:', apiKeys);
  if (apiKeys.length > 0) {
    console.log('Headers:', Object.keys(apiKeys[0]));
  }
  


  // Define columns
  const columns = [
    columnHelper.accessor('apiKey', {
      id: 'apiKey',
      header: () => (
        <Text align="center" fontSize={{ sm: '10px', lg: '12px' }} color="gray.400">
          API KEY
        </Text>
      ),
      cell: (info) => {
        const apiKey = info.getValue();
        const id = info.row.id;
        const isVisible = visibility[id];
        const displayKey = isVisible ? apiKey : apiKey.slice(0, 5) + '*'.repeat(apiKey.length - 5);
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

    columnHelper.accessor('creationDate', {
      id: 'creationDate',
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

  // Configure React Table
  const table = useReactTable({
    columns,
    data: apiKeys, // Use messages from SSE
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const handleDelete = async (id) => {
    try {
      await removeApiKey(id);
      await getApiKeys();
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
      await addKey();
      await getApiKeys();
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
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan} pe="10px" borderColor={borderColor} cursor="pointer" onClick={header.column.getToggleSortingHandler()}>
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
            {loadingKeys ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign="center">Loading...</Text>
                </Td>
              </Tr>
            ) : errorKeys ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Text textAlign="center" color="red.500">
                    {errorKeys.message || 'Failed to load API keys.'}
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
                      <Button colorScheme="teal" size="sm" onClick={() => handleDelete(row.original.id)}>
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
