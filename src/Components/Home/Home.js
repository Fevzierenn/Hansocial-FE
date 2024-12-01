import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import "./Home.css";
import PostForm from '../Post/PostForm';
import { useLocation } from 'react-router-dom';
function Home(){
    const location = useLocation();
    const { userLogin } = location.state || {}; // state içinden userId'yi al

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);

    const refreshPosts = () => {
        fetch("http://localhost:8080/posts")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Bir hata oluştu!");
          }
          return response.json(); // JSON formatına dönüştür
        })
        .then((data) => {
            setIsLoaded(true);
            setPostList(data)
        })
        .catch((error) => {
            console.log(error)
            setIsLoaded(true);
            setError(error);
        });
    }

    useEffect(() => {
        refreshPosts();
    }, []);

    if(error) {
        return <div> Error !!!</div>;
    } else if(!isLoaded) {
        return <div> Loading... </div>;
    } else { 

    return  <div className="home">
        <PostForm  userId = {userLogin.id}   userName = {userLogin.username} 
                title={""} text={""} refreshPosts={refreshPosts} />
        {
          
            postList.map((post) => (
                <Post likes = {post.postLikes} postId = {post.id} userId = {post.userId} userName = {post.userName}  
                title={post.title} text={post.text} date={post.createDate}  />
            ))
        }
        </div>
      
}

}

export default Home;