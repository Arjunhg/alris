import { Loader } from '@mantine/core';

export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Loader size="xl" color="white" />
    </div>
  );
}
