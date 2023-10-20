import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Stats = ({ wordStats }) => {
  return (
    <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Word</StyledTableCell>
            <StyledTableCell align="right">Incorrect Attempts</StyledTableCell>
            <StyledTableCell align="right">Attempts</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wordStats.map((row, index) => (
            <StyledTableRow
              key={row.index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {row.word}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.incorrectAttempts}
              </StyledTableCell>
              <StyledTableCell align="right">
                {row.numberOfAttempts}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Stats;
