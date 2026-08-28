import React from "react";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";


const Protected = ({ children, role = "buyer" }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    if (user.role !== role) {
        return <Navigate to="/" />
    }

    return children

}

export default Protected