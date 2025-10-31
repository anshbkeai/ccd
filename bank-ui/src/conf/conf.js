const conf = {
  backendUrl:
    globalThis.RUNTIME_CONFIG?.BACKEND_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:8080",
};

export default conf;