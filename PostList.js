import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/PostList.css";


function PostList() {

    const [posts, setPosts] = useState([]);

    const navigate = useNavigate();


    // =====================================================
    // FETCH ALL POSTS
    // =====================================================

    const fetchPosts = async () => {

        try {

            const token =
                localStorage.getItem("token");


            // Check token

            if (!token) {

                alert("Please login first");

                navigate("/");

                return;

            }


            console.log(
                "Fetching posts..."
            );


            const response = await axios.get(

                "http://localhost:5001/api/posts",

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            console.log(
                "Posts received:",
                response.data
            );


            // Make sure response is an array

            if (Array.isArray(response.data)) {

                setPosts(response.data);

            }

            else {

                console.log(
                    "Unexpected response:",
                    response.data
                );

                setPosts([]);

            }

        }

        catch (error) {

            console.log(
                "Fetch Posts Error:",
                error
            );


            console.log(
                "Server Response:",
                error.response?.data
            );


            if (
                error.response?.status === 401
            ) {

                alert(
                    "Session expired. Please login again."
                );


                localStorage.removeItem(
                    "token"
                );


                navigate("/");

                return;

            }


            alert(
                error.response?.data?.message ||
                "Failed to load posts"
            );

        }

    };


    // =====================================================
    // LOAD POSTS
    // =====================================================

    useEffect(() => {

        fetchPosts();

    }, []);


    // =====================================================
    // DELETE POST
    // =====================================================

    const deletePost = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this post?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const token =
                localStorage.getItem("token");


            await axios.delete(

                `http://localhost:5001/api/posts/${id}`,

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            alert(
                "Post Deleted Successfully"
            );


            // Refresh posts

            fetchPosts();

        }

        catch (error) {

            console.log(
                "Delete Error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Delete Failed"
            );

        }

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="post-container">


            <h1>
                Post Listing
            </h1>


            <h2>
                Total Posts : {posts.length}
            </h2>


            {

                posts.length === 0

                    ? (

                        <div>

                            <h3>
                                No Posts Available
                            </h3>


                            <button
                                onClick={fetchPosts}
                            >
                                Refresh Posts
                            </button>

                        </div>

                    )

                    : (

                        posts.map((post) => (

                            <div
                                className="post-card"
                                key={post._id}
                            >


                                <h2>
                                    {post.title}
                                </h2>


                                <p>

                                    <b>
                                        Platform:
                                    </b>{" "}

                                    {post.platform}

                                </p>


                                <p>

                                    <b>
                                        Content:
                                    </b>{" "}

                                    {post.content}

                                </p>


                                <p>

                                    <b>
                                        Tags:
                                    </b>{" "}

                                    {
                                        post.tags &&
                                        post.tags.length > 0
                                            ? post.tags.join(", ")
                                            : "No Tags"
                                    }

                                </p>


                                <p>

                                    <b>
                                        Created Time:
                                    </b>{" "}

                                    {
                                        post.createdAt
                                            ? new Date(
                                                post.createdAt
                                            ).toLocaleString()
                                            : "Not Available"
                                    }

                                </p>


                                <p>

                                    <b>
                                        Scheduled Time:
                                    </b>{" "}

                                    {
                                        post.scheduledTime

                                            ? new Date(
                                                post.scheduledTime
                                            ).toLocaleString()

                                            : "Not Scheduled"
                                    }

                                </p>


                                <p>

                                    <b>
                                        Status:
                                    </b>{" "}

                                    {post.status}

                                </p>


                                {

                                    post.media && (

                                        <div>

                                            <img
                                                src={
                                                    `http://localhost:5001/uploads/${post.media}`
                                                }
                                                alt="Post Media"
                                                width="250"
                                            />

                                        </div>

                                    )

                                }


                                <br />


                                <button

                                    onClick={() =>
                                        navigate(
                                            `/edit/${post._id}`
                                        )
                                    }

                                >
                                    Edit
                                </button>


                                <button

                                    onClick={() =>
                                        deletePost(
                                            post._id
                                        )
                                    }

                                >
                                    Delete
                                </button>


                            </div>

                        ))

                    )

            }


        </div>

    );

}


export default PostList;
