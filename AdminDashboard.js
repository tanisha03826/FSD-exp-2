import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {

                setError(
                    "Authentication token not found. Please login again."
                );

                return;
            }


            // Get Users

            const userRes = await axios.get(
                "http://localhost:5001/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            // Get Posts

            const postRes = await axios.get(
                "http://localhost:5001/api/admin/posts",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log("Users:", userRes.data);
            console.log("Posts:", postRes.data);


            setUsers(userRes.data);
            setPosts(postRes.data);

        }

        catch (error) {

            console.log(
                "Admin Dashboard Error:",
                error
            );


            if (error.response) {

                if (error.response.status === 401) {

                    setError(
                        "Authentication failed. Please login again."
                    );

                }

                else if (error.response.status === 403) {

                    setError(
                        "Access denied. Admin access required."
                    );

                }

                else {

                    setError(
                        error.response.data?.message ||
                        "Failed to load admin dashboard."
                    );

                }

            }

            else {

                setError(
                    "Unable to connect to the backend server."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    const deleteUser = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const token = localStorage.getItem("token");


            await axios.delete(
                `http://localhost:5001/api/admin/user/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            alert(
                "User Deleted Successfully"
            );


            fetchData();

        }

        catch (error) {

            console.log(
                "Delete User Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to delete user."
            );

        }

    };

    const deletePost = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this post?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            const token = localStorage.getItem("token");


            await axios.delete(
                `http://localhost:5001/api/admin/post/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            alert(
                "Post Deleted Successfully"
            );


            fetchData();

        }

        catch (error) {

            console.log(
                "Delete Post Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to delete post."
            );

        }

    };

    if (loading) {

        return (

            <div className="admin-container">

                <div className="loading">

                    Loading Admin Dashboard...

                </div>

            </div>

        );

    }

    return (

        <div className="admin-container">


            {/* HEADER */}

            <div className="admin-header">

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Manage users and posts
                </p>

            </div>



            {/* ERROR */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}



            {/* STATISTICS */}

            <div className="stats">


                <div className="stat-card">

                    <h2>
                        {users.length}
                    </h2>

                    <p>
                        Total Users
                    </p>

                </div>



                <div className="stat-card">

                    <h2>
                        {posts.length}
                    </h2>

                    <p>
                        Total Posts
                    </p>

                </div>


            </div>



            {/* USERS */}

            <section className="admin-section">


                <div className="section-header">

                    <h2>
                        Users
                    </h2>

                    <span>
                        {users.length} users
                    </span>

                </div>



                {users.length === 0 ? (

                    <p className="empty-message">
                        No users found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.map((user) => (

                                    <tr key={user._id}>

                                        <td>
                                            {user.name}
                                        </td>


                                        <td>
                                            {user.email}
                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    user.role === "admin"
                                                        ? "role admin-role"
                                                        : "role user-role"
                                                }
                                            >

                                                {user.role}

                                            </span>

                                        </td>


                                        <td>

                                            {user.role === "admin" ? (

                                                <span className="protected-user">
                                                    Protected
                                                </span>

                                            ) : (

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteUser(user._id)
                                                    }
                                                >

                                                    Delete User

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>



            {/* POSTS */}

            <section className="admin-section">


                <div className="section-header">

                    <h2>
                        Posts
                    </h2>

                    <span>
                        {posts.length} posts
                    </span>

                </div>



                {posts.length === 0 ? (

                    <p className="empty-message">
                        No posts found.
                    </p>

                ) : (

                    <div className="posts-container">

                        {posts.map((post) => (

                            <div
                                className="admin-card"
                                key={post._id}
                            >


                                <div className="post-header">

                                    <h3>

                                        {post.title ||
                                            "Untitled Post"}

                                    </h3>


                                    <span className="platform">

                                        {post.platform ||
                                            "Unknown"}

                                    </span>

                                </div>



                                <p className="post-content">

                                    {post.content ||
                                        "No content"}

                                </p>



                                <p className="post-id">

                                    Post ID:
                                    {" "}
                                    {post._id}

                                </p>



                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deletePost(post._id)
                                    }
                                >

                                    Delete Post

                                </button>


                            </div>

                        ))}

                    </div>

                )}

            </section>


        </div>

    );

}


export default AdminDashboard
