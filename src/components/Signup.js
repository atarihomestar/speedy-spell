import { useState } from "react";
import { Alert, Button, Paper, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== passwordConfirmation) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to create an account");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "440px",
        margin: "auto",
        marginTop: "300px",
        textAlign: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "400px",
          paddingX: "20px",
          paddingY: "5px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "24px" }}>Sign Up</p>
        {error && (
          <Alert severity="error" style={{ marginBottom: "20px" }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginTop: "20px" }}
        />
        <TextField
          label="Password Confirmation"
          type="password"
          fullWidth
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          sx={{ marginY: "20px" }}
        />
        <Button
          variant="contained"
          sx={{ marginBottom: "20px" }}
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          Sign Up
        </Button>
      </Paper>
      <p>
        Already have an account?{" "}
        <Link to="/login" className="link-no-underline">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Signup;
