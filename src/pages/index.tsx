import { Input } from "@/components/Input";
import styled from "@emotion/styled";
import { supabase } from "@/lib/Store";
import { useState } from "react";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (
    type: string,
    username: string,
    password: string
  ) => {
    try {
      const {
        error,
        data: { user },
      } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({
              email: username,
              password,
            })
          : await supabase.auth.signUp({ email: username, password });
      // If the user doesn't exist here and an error hasn't been raised yet,
      // that must mean that a confirmation email has been sent.
      // NOTE: Confirming your email address is required by default.
      if (error) {
        alert("Error with auth: " + error.message);
      } else if (!user)
        alert("Signup successful, confirmation mail should be sent soon!");
    } catch (error: any) {
      console.log("error", error);
      alert(error.error_description || error);
    }
  };

  return (
    <Container>
      <Wrap>
        <Input
          label={"Email"}
          type="text"
          placeholder="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label={"Password"}
          type="password"
          placeholder="Your Password"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div>
          <a
            onClick={(e) => {
              e.preventDefault();
              handleLogin("SIGNUP", username, password);
            }}
            href={"/channels"}
          >
            Sign up
          </a>
          <a
            onClick={(e) => {
              e.preventDefault();
              handleLogin("LOGIN", username, password);
            }}
            href={"/channels"}
          >
            Login
          </a>
        </div>
      </Wrap>
    </Container>
  );
};

const Wrap = styled.div``;

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
`;

export default Home;
