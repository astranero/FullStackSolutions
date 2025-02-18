const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    var count = 0;
    for (blog of blogs){
        count += blog.likes;
    }
    return count;
}

const favoriteBlog = (blogs) => {
    var max_count = 0;
    var favorite_blog = blogs[0];
    for (const blog of blogs){
        if (blog.likes > max_count){
            max_count = blog.likes
            favorite_blog = blog
        }
    }
    return favorite_blog
}

const mostBlogs = (blogs) => {
    var authors = {};
    for (let blog of blogs){
        if (!authors[blog.author]){
            authors[blog.author] = 0
        }
        authors[blog.author] += 1
    }

    let maxAuthor = null;
    let blogCount = -Infinity;
    Object.keys(authors).forEach(author => {
        if (authors[author] > blogCount){
            maxAuthor = author
            blogCount =  authors[author]
        }
    })

    return {"author": maxAuthor, "blogs": blogCount }
}

const mostLikes = (blogs) => {
    var authors = {};
    for (let blog of blogs){
        if (!authors[blog.author]){
            authors[blog.author] = 0
        }
        authors[blog.author] += blog.likes
    }

    let maxAuthor = null;
    let likesCount = -Infinity;
    Object.keys(authors).forEach(author => {
        if (authors[author] > likesCount){
            maxAuthor = author
            likesCount =  authors[author]
        }
    })

    return {"author": maxAuthor, "likes": likesCount }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
