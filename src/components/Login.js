import { useState } from "react";
import { Alert, Button, Paper, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to log in");
    }
    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        width: "440px",
        textAlign: "center",
        margin: "auto",
        marginTop: "300px",
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
        <p style={{ fontSize: "24px" }}>Log In</p>
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
          onKeyDown={handleKeyDown}
          sx={{ marginY: "20px" }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          Log In
        </Button>
        <Button sx={{ marginY: "10px" }}>Forgot Password?</Button>
      </Paper>
      <p>
        Need an account?{" "}
        <Link className="link-no-underline" to="/signup">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
