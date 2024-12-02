import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import "./Home.css";
import PostForm from '../Post/PostForm';


function Home(){
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    const user = localStorage.getItem('user');
    const userLogin = JSON.parse(user);
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
        const user = getSafeData('user'); // 'user' bilgisini JSON olarak alır
        console.log(user);
        refreshPosts();
    }, []);
    const getSafeData = (key) => {
        const data = localStorage.getItem(key);
        if (!data) {
          console.log(`${key} anahtarı bulunamadı.`);
          return null;
        }
      
        try {
          return JSON.parse(data); // JSON formatında olduğunu doğrular
        } catch (error) {
          console.error(`${key} anahtarı JSON formatında değil:`, error);
          return null;
        }
      };
    const checkKeyExists = (key) => {
        if (localStorage.getItem(key) !== null) {
          console.log(`${key} anahtarı mevcut.`);
        } else {
          console.log(`${key} anahtarı bulunamadı.`);
        }
      };


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