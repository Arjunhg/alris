import { Alert } from '@mantine/core';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Alert 
      title="Error" 
      color="red" 
      variant="filled"
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
    >
      {message}
    </Alert>
  );
}
