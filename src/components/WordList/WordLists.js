import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../../contexts/AuthContext";
import { getWordLists } from "../../utils/firebase";
import WordListPopup from "./WordListPopup";

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

export const WordLists = () => {
  const [wordLists, setWordLists] = useState([]);

  const [selectedRowData, setSelectedRowData] = useState({});
  const [add, setAdd] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { user } = useAuth();

  const updateWordLists = async () => {
    const newWordLists = await getWordLists(user);
    setWordLists(newWordLists);
  };

  useEffect(() => {
    updateWordLists();
  }, [user]);

  const onRowClick = (id, uid, name, words) => {
    setAdd(false);
    setSelectedRowData({ id: id, uid: uid, name: name, words: words });
    setShowPopup(true);
  };

  const handleAddButtonClick = () => {
    setAdd(true);
    setSelectedRowData({ uid: user.uid });
    setShowPopup(true);
  };

  return (
    <div>
      {showPopup ? (
        <WordListPopup
          add={add}
          setShowPopup={setShowPopup}
          data={selectedRowData}
          updateWordLists={updateWordLists}
        />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ width: 450 }}>
            <Table sx={{ minWidth: 450 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ width: "100px" }}>
                    List Name
                  </StyledTableCell>
                  <StyledTableCell align="right">Words</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wordLists.map((row) => (
                  <StyledTableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    onClick={() =>
                      onRowClick(row.id, row.uid, row.name, row.words)
                    }
                  >
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.words}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <IconButton onClick={handleAddButtonClick}>
            <AddIcon />
          </IconButton>
        </>
      )}
    </div>
  );
};

export default WordLists;
