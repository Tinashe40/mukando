import React from "react";
import { AuthProvider } from './contexts/AuthContext';
import { FlashMessageProvider } from './contexts/FlashMessageContext';
import FlashMessageDisplay from './components/ui/FlashMessageDisplay';
import Routes from "./Routes";

function App() {
  return (
    <FlashMessageProvider>
      <AuthProvider>
        <Routes />
        <FlashMessageDisplay />
      </AuthProvider>
    </FlashMessageProvider>
  );
}

export default App;