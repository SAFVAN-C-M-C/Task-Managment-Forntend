interface ApiResponseError extends Error {
    response?: {
      data?: {
        message?: string;
      };
      status?: number;
    };
  }
// Error handler function
export const handleError = (
    error: ApiResponseError,
    rejectWithValue: (value: string | unknown) => void
  ) => {
    if (error.response?.data?.message) {
      return rejectWithValue(error.response.data.message);
    } else if (error.message) {
      return rejectWithValue(error.message);
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  };