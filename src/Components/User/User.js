import React, { useState, useEffect } from 'react';
import { Avatar, Button, Grid, Typography, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useUser } from '../../context/UserContextU.js';

function User() {
    const { user, updateUser } = useUser();
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || 0);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editText, setText] = useState('');
    const [openCommentDialog, setOpenCommentDialog] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const avatars = [
        '/avatars/avatar1.jpg',
        '/avatars/avatar2.jpg',
        '/avatars/avatar3.jpg',
        '/avatars/avatar4.jpg',
        '/avatars/avatar5.jpg',
        '/avatars/avatar6.jpg'
    ];

    useEffect(() => {
        const hasRefreshed = sessionStorage.getItem('userPageRefreshed');
        
        if (!hasRefreshed) {
            sessionStorage.setItem('userPageRefreshed', 'true');
            window.location.reload();
            return;
        }
    }, []);

    const handleAvatarChange = (index) => {
        setSelectedAvatar(index);
        changeAvatar(index);
        console.log(index);
        // Avatar değişikliğini kaydetmek için bir API çağrısı yapılabilir
    };  

    const changeAvatar = (index) => {
        const userId = user.id;
        const apiUrl = `http://localhost:8080/users/${userId}/avatar?avatar=${index}`;

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Avatar güncellenemedi');
            }
            return response.json();
        })
        .then(data => {
            // Kullanıcı bilgilerini güncelle
            const updatedUser = { ...user, avatar: index };
            updateUser(updatedUser);
            console.log('Avatar başarıyla güncellendi:', data);
        })
        .catch(error => {
            console.error('Hata:', error);
        });
    };

    const handlePostUpdate = (post) => {
        setEditingPost(post);
        setEditTitle(post.title);
        setText(post.text);
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
        setEditingPost(null);
        setEditTitle('');
        setText('');
    };

    const handleEditSave = () => {
        if (!editingPost) return;

        fetch(`http://localhost:8080/posts/${editingPost.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: editTitle,
                text: editText,
                userId: user.id
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Güncelleme başarısız');
            return response.json();
        })
        .then(() => {
            getAllPosts(); // Postları yeniden yükle
            handleEditClose();
        })
        .catch(error => {
            console.error('Hata:', error);
        });
    };

    const handlePostDelete = (postId) => {
        fetch(`http://localhost:8080/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Silme işlemi başarısız');
            getAllPosts(); // Postları yeniden yükle
        })
        .catch(error => {
            console.error('Hata:', error);
        });
    };

    const handleCommentUpdate = (comment) => {
        setEditingComment(comment);
        setEditCommentText(comment.text);
        setOpenCommentDialog(true);
    };

    const handleCommentEditClose = () => {
        setOpenCommentDialog(false);
        setEditingComment(null);
        setEditCommentText('');
    };

    const handleCommentEditSave = () => {
        if (!editingComment) return;

        fetch(`http://localhost:8080/comments/${editingComment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: editCommentText,
                userId: user.id,
                postId: editingComment.postId
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Yorum güncellemesi başarısız');
            return response.json();
        })
        .then(() => {
            getAllComments(); // Yorumları yeniden yükle
            handleCommentEditClose();
        })
        .catch(error => {
            console.error('Hata:', error);
        });
    };

    const handleCommentDelete = (commentId) => {
        fetch(`http://localhost:8080/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Yorum silme işlemi başarısız');
            getAllComments(); // Yorumları yeniden yükle
        })
        .catch(error => {
            console.error('Hata:', error);
        });
    };

    const getAllComments = () => {
        fetch(`http://localhost:8080/comments?userId=${user.id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Bir hata oluştu!");
            }
            return response.json();
        })
        .then((data) => {
            setComments(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
            console.log(error);
            setComments([]);
        });
    }

    const getAllPosts = () => {
        
        fetch(`http://localhost:8080/posts?userId=${user.id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Bir hata oluştu!");
            }
            return response.json();
        })
        .then((data) => {
            setPosts(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
            console.log(error);
            setComments([]);
        });
    }

    useEffect(() => {
        getAllComments();
        getAllPosts();
    }, []);

    return (
        <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            padding: '0 50px'
        }}>
            <Typography variant="h4">{user.username} Profili</Typography>
            <Grid container spacing={2}>
                <Grid item container xs={12}>
                    <Typography variant="h6">Avatar Seçimi</Typography>
                    <Grid container item spacing={1}>
                        {avatars.map((avatar, index) => (
                            <Grid item key={index}>
                                <Avatar
                                    src={avatar}
                                    onClick={() => handleAvatarChange(index)}
                                    style={{ border: selectedAvatar === index ? '2px solid blue' : 'none' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                
                <Grid item xs={12}>
                    <Typography variant="h6">Gönderilerim</Typography>
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <Card key={post.id}
                                sx={{ 
                                    border: '1px solid black',
                                    marginBottom: '10px'
                                }}>
                                <CardContent>
                                    <Typography  style={{ fontWeight: 'bold' }}>{post.title}</Typography>
                                    <Typography>{post.text}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handlePostUpdate(post)}>Güncelle</Button>
                                    <Button onClick={() => handlePostDelete(post.id)}>Sil</Button>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography>Henüz gönderi yapılmamış</Typography>
                    )}
                </Grid>
                
                <Grid item xs={12}>
                    <Typography variant="h6">Yorumlarım</Typography>
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment) => (
                            <Card key={comment.id}
                                sx={{ 
                                    border: '1px solid black',
                                    marginBottom: '10px'
                                }}>
                                <CardContent>
                                    <Typography>{comment.text}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handleCommentUpdate(comment)}>Güncelle</Button>
                                    <Button onClick={() => handleCommentDelete(comment.id)}>Sil</Button>
                                </CardActions>
                            </Card>
                        ))
                    ) : (
                        <Typography>Henüz yorum yapılmamış</Typography>
                    )}
                </Grid>

            </Grid>
            <Dialog open={openEditDialog} onClose={handleEditClose}>
                <DialogTitle>Gönderi Düzenle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Başlık"
                        fullWidth
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="İçerik"
                        fullWidth
                        multiline
                        rows={4}
                        value={editText}
                        onChange={(e) => setText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>İptal</Button>
                    <Button onClick={handleEditSave}>Kaydet</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openCommentDialog} onClose={handleCommentEditClose}>
                <DialogTitle>Yorum Düzenle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Yorum"
                        fullWidth
                        multiline
                        rows={4}
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCommentEditClose}>İptal</Button>
                    <Button onClick={handleCommentEditSave}>Kaydet</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default User;