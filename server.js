const express=require('express')
const axios=require("axios");
const _ = require('lodash');
const app=express();
const dotenv=require('dotenv')
dotenv.config();
app.use(express.json());

const port=5000;
app.get('/api/blog-stats', async (req, res) => {
    try {
        
      // Make a GET request to fetch the blog data
      const blogData = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
        headers: {
            'x-hasura-admin-secret': process.env.KEY
          }
      }); 
      
      const blogs = blogData.data.blogs; // Assuming the data is an array of blogs
      
      const totalBlogs =_.size(blogs);
       const longestTitleBlog = _.maxBy(blogs, 'title.length').title;
      
      const privacyBlogs = _.filter(blogs, blog => blog.title.toLowerCase().includes('privacy'));
      const arr = _.uniqBy(blogs, 'title');
      const uniqueTitles=_.map(arr,'title')
      res.setHeader('Content-Type', 'application/json');
    
    res.json({
      totalBlogs:totalBlogs,
      longestTitleBlog:longestTitleBlog,
      privacyBlogsCount: privacyBlogs.length,
      uniqueTitles:uniqueTitles,
    });
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error('Error fetching blog data:', error);
      res.status(500).json({ error: 'Failed to fetch blog data' });
    }
  });
  app.get("/api/blog-search",async(req,res)=>{
    try {
      const query = req.query.text
      if (!query) {
        return res.status(400).json({ error: 'Query parameter "query" is required' });
      }
      const blogData = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
        headers: {
            'x-hasura-admin-secret': process.env.KEY
          }
      }); 
      
      const blogs = blogData.data.blogs;
      const ans=_.filter(blogs, blog => blog.title.toLowerCase().includes(query.toLowerCase()));
      res.setHeader('Content-Type', 'application/json');
      res.json(ans);

      
    } catch (error) {
      
    }
  })
  
app.listen(port,()=>{
    console.log("server has started")
})