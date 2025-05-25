import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Flex, 
  IconButton, 
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr, 
  useColorModeValue, 
  useToast, 
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import useVisibility from 'hooks/useVisibility';
import useGetUserApiKeys from 'hooks/apiKeys/useGetUserApiKeys';
import { useUser } from '@clerk/clerk-react';

import useAddApiKey from 'hooks/apiKeys/useAddKey';
import usePatchApiKey from 'hooks/apiKeys/usePatchKey'; // Import the new patch hook

const columnHelper = createColumnHelper();

const ComplexTable = React.memo(() => {
  const { user } = useUser();
  const { keys, loading, error, fetchKeys } = useGetUserApiKeys(user?.id);

  const { createApiKey, loading: createLoading, error: createError, apiKey } = useAddApiKey();
  const { softDeleteApiKey, loading: patchLoading, error: patchError, successMessage } = usePatchApiKey(); // Use patch hook

  const [sorting, setSorting] = React.useState([]);
  const { visibility, toggleVisibility } = useVisibility();
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  
  // State for delete confirmation modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [keyToDelete, setKeyToDelete] = useState(null);

  const handleButtonClick = async () => {
    if (!user?.id) return;  
    await createApiKey(user.id); 
  };

  const handleSoftDeleteApiKey = async (api_key) => {
    await softDeleteApiKey(api_key);
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

        // Create a masked version with the same length as the original
        const visiblePart = apiKey.slice(0, 5);
        const hiddenPart = '*'.repeat(apiKey.length - 5);
        const displayKey = isVisible ? apiKey : visiblePart + hiddenPart;
        
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
              fontFamily="monospace"
              width="100%"
            >
              {displayKey}
            </Text>
            <IconButton
              onClick={() => toggleVisibility(id)}
              icon={isVisible ? <MdVisibilityOff /> : <MdVisibility />}
              ml={2}
              size="sm"
              aria-label={isVisible ? 'Hide API Key' : 'Show API Key'}
              flexShrink={0}
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
    columnHelper.accessor('n_uses', {
      id: 'n_uses',
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

  // Open confirmation modal and set the key to delete
  const openDeleteConfirmation = (api_key) => {
    setKeyToDelete(api_key);
    onOpen();
  };

  // Handle confirmed soft deletion
  const confirmDelete = async () => {
    try {
      await handleSoftDeleteApiKey(keyToDelete);
      await fetchKeys();
      toast({
        position: 'top-center',
        title: 'API key marked as deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        position: 'top-center',
        title: 'Error marking API key as deleted',
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
                      <Button colorScheme="teal" size="sm" onClick={() => openDeleteConfirmation(row.original.api_key)}>
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={3}>
            Confirm Deletion
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={0}>
            <Text>
              Are you sure you want to delete this API key?
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              The key will be marked as deleted and disabled.
            </Text>
          </ModalBody>

          <ModalFooter pt={4}>
            <Button 
              variant="outline" 
              mr={3} 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={confirmDelete} 
              isLoading={patchLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
});

export default ComplexTable;