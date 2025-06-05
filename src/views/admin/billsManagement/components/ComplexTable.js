
// Third ComplexTable.js with updated pagination
import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Tag } from '@chakra-ui/react';
import { MdCancel, MdCheckCircle, MdOutlineError } from 'react-icons/md';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import Card from 'components/card/Card';
import { useSubscription } from 'contexts/paddle/SubscriptionContext';

const columnHelper = createColumnHelper();

export default function ComplexTable(props) {
  const { transactionDataTable } = useSubscription();
  const [tableData, setTableData] = useState([]);
  

  useEffect(() => {
    if (transactionDataTable && transactionDataTable.length > 0) {
        const transformedData = transactionDataTable.map((transaction) => {
        const startDate = new Date(transaction?.billing_period?.starts_at || Date.now());
        const endDate = new Date(transaction?.billing_period?.ends_at || Date.now());
        const formattedStartDate = startDate.toLocaleDateString('en-CA').replace(/-/g, '/');
        const formattedEndDate = endDate.toLocaleDateString('en-CA').replace(/-/g, '/');

        return {
          invoice_number: transaction.invoice_number,
          subscription_type: transaction.items[0].price.name,
          amount: transaction.details.adjusted_totals.grand_total,
          issued_date: `${formattedStartDate} - ${formattedEndDate}`,
          status: transaction.status,
        };
      });
      
      setTableData(transformedData);
    }
  }, [transactionDataTable]);

  const [sorting, setSorting] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const columns = [
    columnHelper.accessor('invoice_number', {
      id: 'invoice_number',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          BILL ID
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
    columnHelper.accessor('subscription_type', {
      id: 'subscription_type',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          SUBSCRIPTION TYPE
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Tag variant='solid' colorScheme='teal'> {info.getValue()}</Tag>
        </Flex>
      ),
    }),
    columnHelper.accessor('amount', {
      id: 'amount',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          AMOUNT
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()} $
          </Text>
        </Flex>
      ),
    }),
    columnHelper.accessor('issued_date', {
      id: 'issued_date',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          BILLING PERIOD
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          STATUS
        </Text>
      ),
      cell: (info) => (
        <Flex align="center">
          <Icon
            w="24px"
            h="24px"
            me="5px"
            color={
              info.getValue() === 'completed'
                ? 'green.500'
                : info.getValue() === 'cancled'
                ? 'red.500'
                : info.getValue() === 'ready'
                ? 'orange.500'
                : null
            }
            as={
              info.getValue() === 'completed'
                ? MdCheckCircle
                : info.getValue() === 'cancled'
                ? MdCancel
                : info.getValue() === 'ready'
                ? MdOutlineError
                : null
            }
          />
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      ),
    }),
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
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
          Billing History
        </Text>
      </Flex>
      <Box data-testid="complex-table">
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
            {table.getRowModel().rows.map((row) => {
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
        
        {/* Standardized Pagination Controls */}
        {tableData.length > 0 ? (
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
        ) : (
          <Flex justifyContent="center" p="4">
            <Text color="gray.500">No billing history available</Text>
          </Flex>
        )}
      </Box>
    </Card>
  );
}