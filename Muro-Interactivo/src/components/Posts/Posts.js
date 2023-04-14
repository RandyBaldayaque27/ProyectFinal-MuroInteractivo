import { useEffect, useState } from "react";
import firebase from "../../firebase";
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Posts() {
    const [values, setValues] = useState({
        posts: ""
    });
    const [posts, setPosts] = useState([]);

    const getData = async () => {
        const getPost = [];
        const db = firebase.firestore()
            .collection("Posts")
            .orderBy("createdAt", "asc")
            .onSnapshot((query) => {
                query.forEach((doc) => {
                    getPost.push({
                        ...doc.data(),
                        key: doc.idPosts,
                    });
                });
                setPosts(getPost);
            });
        return () => db();
    };

    const handleSubmission = async (e) => {
        e.preventDefault();

        const user = firebase.auth().currentUser;
        if (!user) {
            toast.error('Inicia sesión.', {
                position: toast.POSITION.TOP_LEFT
            });
            return;
        }

        if (!values.posts) {
            toast.error('Inserta un post.', {
                position: toast.POSITION.TOP_LEFT
            });
            return;
        }

        try {
            const userData = await firebase.firestore().collection("users").doc(user.uid).get();
            const fullName = `${userData.data().name} ${userData.data().lastname}`;
            const createdAt = moment().format("DD/MM/YYYY HH:mm:ss A");

            const newPostRef = firebase.firestore().collection('Posts').doc();
            await newPostRef.set({
                idPosts: newPostRef.id,
                idUser: user.uid,
                fullName,
                post: values.posts,
                createdAt,
            });

            toast.success('Se publicó con éxito.', {
                position: toast.POSITION.TOP_LEFT
            });
            getData();
        } catch (error) {
            console.error("Error", error);
        }
    }


    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="container" style={{ marginTop: "15px" }}>
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card" style={{ backgroundColor: "#d1d1d1" }}>
                        <div className="card-body">
                            <div className="col-md-12">
                                <label htmlFor="post-input" style={{ color: "#0f0f0f", fontWeight: "bold" }}>¿Qué estás pensando?</label>
                                <textarea
                                    className="form-control"
                                    id="post-input"
                                    rows="3"
                                    placeholder="Escribe un nuevo post."
                                    value={values.posts}
                                    onChange={(event) => setValues(prev => ({ ...prev, posts: event.target.value }))}
                                    style={{ backgroundColor: "#ffff", color: "#28d771", borderRadius: "5px", marginTop: "10px" }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-grid gap-2 col-11 d-flex justify-content-end">
                            <input type="button" onClick={handleSubmission} className="btn btn-success" value="Publicar" />
                        </div>
                        <br />
                    </div>
                </div>
            </div>
            <br />
            {posts.length > 0 && (
                <div className="container-fluid bg-light py-4">
                    <ToastContainer />
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            {posts.map((post) =>
                                <div className="card mb-3" key={post.id}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="card-title mb-0">{post.fullName}</h5>
                                            <small className="text-muted">{post.createdAt}</small>
                                        </div>
                                        <hr />
                                        <p className="card-text">{post.post}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Posts