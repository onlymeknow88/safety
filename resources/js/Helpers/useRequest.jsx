import { useState, useCallback } from "react";
import axios from "axios";
import TokenManager from "@/Utils/TokenManager";

/**
 * Custom Hooks for API Requests
 * Adapted for Laravel Inertia + React (using TokenManager for JWT)
 */

const host = "/api/";

// Global Axios Interceptor untuk menangani Token Expired (401)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            TokenManager.logout(); // Pakai logout() yang sudah include hapus token + redirect
        }
        return Promise.reject(error);
    }
);

// With Authorization (GET)
export function useGet() {
    const [successRes, setSuccessRes] = useState({});
    const [errorsRes, setErrorsRes] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    const req = useCallback((args = {}, endpoint = "") => {
        setLoading(true);
        setSuccessRes({});
        setErrorsRes({});
        setSuccess(false);
        setFailed(false);

        const url = `${host}${endpoint}`.replace(/\/+/g, "/");

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + TokenManager.getToken(),
            },
            params: args,
            url,
        };

        return axios(options)
            .then((res) => {
                setSuccessRes(res);
                setFailed(false);
                setSuccess(true);
                setLoading(false);
                return res;
            })
            .catch((e) => {
                setErrorsRes(e.response);
                setSuccessRes({});
                setFailed(true);
                setSuccess(false);
                setLoading(false);
                throw e;
            });
    }, []);

    const feedback = {
        success_res: successRes.data,
        error_res: errorsRes,
        loading: loading,
        success: success,
        failed: failed,
        response: successRes,
    };
    return [req, feedback];
}

// Without Authorization (GET)
export function useGetViewer() {
    const [successRes, setSuccessRes] = useState({});
    const [errorsRes, setErrorsRes] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    function req(args = {}, endpoint = "") {
        setLoading(true);
        setSuccessRes({});
        setErrorsRes({});
        setSuccess(false);
        setFailed(false);

        const url = `${host}${endpoint}`.replace(/\/+/g, "/");

        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            params: args,
            url,
        };

        return axios(options)
            .then((res) => {
                setSuccessRes(res);
                setFailed(false);
                setSuccess(true);
                setLoading(false);
                return res;
            })
            .catch((e) => {
                setErrorsRes(e.response);
                setSuccessRes({});
                setFailed(true);
                setSuccess(false);
                setLoading(false);
                throw e;
            });
    }

    const feedback = {
        success_res: successRes.data,
        error_res: errorsRes,
        loading: loading,
        success: success,
        failed: failed,
        response: successRes,
    };
    return [req, feedback];
}

// Without Authorization (POST)
export function usePostViewer(endpoint = "") {
    const [successRes, setSuccessRes] = useState({});
    const [errorsRes, setErrorsRes] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    function req(args = {}) {
        setLoading(true);
        setSuccessRes({});
        setErrorsRes({});
        setSuccess(false);
        setFailed(false);

        const url = `${host}${endpoint}`.replace(/\/+/g, "/");
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            data: args,
            url,
        };

        return axios(options)
            .then((res) => {
                setSuccessRes(res);
                setFailed(false);
                setSuccess(true);
                setLoading(false);
                return res;
            })
            .catch((e) => {
                setErrorsRes(e.response);
                setSuccessRes({});
                setFailed(true);
                setSuccess(false);
                setLoading(false);
                throw e;
            });
    }

    const feedback = {
        success_res: successRes.data,
        error_res: errorsRes,
        loading: loading,
        success: success,
        failed: failed,
        response: successRes,
    };
    return [req, feedback];
}

// With Authorization (POST)
export function usePost(endpoint = "") {
    const [successRes, setSuccessRes] = useState({});
    const [errorsRes, setErrorsRes] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    const req = useCallback((args = {}) => {
        setLoading(true);
        setSuccessRes({});
        setErrorsRes({});
        setSuccess(false);
        setFailed(false);

        const url = `${host}${endpoint}`.replace(/\/+/g, "/");
        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + TokenManager.getToken(),
            },
            data: args,
            url,
        };

        return axios(options)
            .then((res) => {
                setSuccessRes(res);
                setFailed(false);
                setSuccess(true);
                setLoading(false);
                return res;
            })
            .catch((e) => {
                setErrorsRes(e.response);
                setSuccessRes({});
                setFailed(true);
                setSuccess(false);
                setLoading(false);
                throw e;
            });
    }, [endpoint]);

    const feedback = {
        success_res: successRes.data,
        error_res: errorsRes,
        loading: loading,
        success: success,
        failed: failed,
        response: successRes,
    };
    return [req, feedback];
}

// With Authorization (PUT) - Additional helper
export function usePut(endpoint = "") {
    const [successRes, setSuccessRes] = useState({});
    const [errorsRes, setErrorsRes] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    const req = useCallback((args = {}, id = "") => {
        setLoading(true);
        setSuccessRes({});
        setErrorsRes({});
        setSuccess(false);
        setFailed(false);

        const targetEndpoint = id ? `${endpoint}/${id}` : endpoint;
        const url = `${host}${targetEndpoint}`.replace(/\/+/g, "/");

        const options = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + TokenManager.getToken(),
            },
            data: args,
            url,
        };

        return axios(options)
            .then((res) => {
                setSuccessRes(res);
                setFailed(false);
                setSuccess(true);
                setLoading(false);
                return res;
            })
            .catch((e) => {
                setErrorsRes(e.response);
                setSuccessRes({});
                setFailed(true);
                setSuccess(false);
                setLoading(false);
                throw e;
            });
    }, [endpoint]);

    const feedback = {
        success_res: successRes.data,
        error_res: errorsRes,
        loading: loading,
        success: success,
        failed: failed,
        response: successRes,
    };
    return [req, feedback];
}

// With Authorization (DELETE) - Additional helper
export function useDelete(endpoint = "") {
    const [successRes, setSuccessRes] = useState({});
    const [errorsRes, setErrorsRes] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    const req = useCallback((id = "") => {
        setLoading(true);
        setSuccessRes({});
        setErrorsRes({});
        setSuccess(false);
        setFailed(false);

        const targetEndpoint = id ? `${endpoint}/${id}` : endpoint;
        const url = `${host}${targetEndpoint}`.replace(/\/+/g, "/");

        const options = {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + TokenManager.getToken(),
            },
            url,
        };

        return axios(options)
            .then((res) => {
                setSuccessRes(res);
                setFailed(false);
                setSuccess(true);
                setLoading(false);
                return res;
            })
            .catch((e) => {
                setErrorsRes(e.response);
                setSuccessRes({});
                setFailed(true);
                setSuccess(false);
                setLoading(false);
                throw e;
            });
    }, [endpoint]);

    const feedback = {
        success_res: successRes.data,
        error_res: errorsRes,
        loading: loading,
        success: success,
        failed: failed,
        response: successRes,
    };
    return [req, feedback];
}
