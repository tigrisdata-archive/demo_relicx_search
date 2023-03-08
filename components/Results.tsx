import { Text, Table, TableHead, TableHeaderCell, TableRow, TableBody, TableCell } from '@tremor/react';
import { ISearchResult } from './types';

type Props = {
  data: ISearchResult;
};
export default function Results({ data }: Props) {
  return (
    <>
      <Table marginTop='mt-5'>
        <TableHead>
          <TableRow>
            <TableHeaderCell>user_id</TableHeaderCell>
            <TableHeaderCell>org_id</TableHeaderCell>
            <TableHeaderCell>Raw</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data._hits.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item._document.user_id}</TableCell>
              <TableCell>
                <Text>{item._document.org_id}</Text>
              </TableCell>
              <TableCell>
                <Text>{JSON.stringify(item._document, null, 2)}</Text>
              </TableCell>
              {/* <TableCell>
                <Text>{item}</Text>
              </TableCell>
              <TableCell>
                <Badge text={item} color='emerald' icon={CogIcon} />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
