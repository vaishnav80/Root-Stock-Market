import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { addContent, editContent, getContent } from "../../actions/Lesson";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const EditContent = () => {
  const [image, setImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {headingId,id,heading} = useParams()
  const auth = useSelector((select)=>select.auth)
  const navigate = useNavigate()
  const [image2, setImage2] = useState(null);
  const [errors,setErrors] = useState({})
  const [data,setData] = useState({
    sub_heading : '',
    content :"",
    video_url : "",
    
  })
  useEffect(()=>{
    async function fetchdata() {
    
        const response = await getContent(auth.token,headingId)
        if (response.status ==200) {
          
        
        response.data.content.filter((index)=>{
              console.log(index);
              
              if (index.id == id) {
                setData(prevData => ({
                    ...prevData,
                    sub_heading: index.sub_heading,
                    content: index.content,
                    video_url: index.video_url || '',
                }));
            
                if (index.image) {
                  setImage(`http://127.0.0.1:8000${index.image}`)
                }
            }
          })
        }    
        
    }
    fetchdata()
  },[])
  console.log(data);
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file)); 
      setImage2(file)
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleformSave =async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('sub_heading', data.sub_heading);
    formData.append('content', data.content);
    if (data.video_url) {
      formData.append('video_url', data.video_url);
    }
    formData.append('heading_id',headingId)
    if(image2){
      console.log(image2,'image');
      formData.append('image',image2)
    }
    console.log(formData);
    
    const response = await editContent(auth.token,formData,id)
    console.log(response,'fgdfg');
    
      if (response.status ==200){
        
        navigate(`/admin/content/${headingId}/${heading}`)
        console.log(response);
        
        toast.success(response.data.message);
      
        }

      
      else{
        console.log(response.data.errors);
        setErrors(response.data.errors)
        setIsModalOpen(false);
      }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add/Edit Content</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="heading">
              Heading:
            </label>
            <input
              type="text"
              id="heading"
              value={heading}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="subheading">
              Subheading:
            </label>
            <input
              type="text"
              id="subHeading"
              name="sub_heading"
              value={data.sub_heading}
              placeholder="Enter the subheading"
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.sub_heading && (
                    <span style={{ color: "red" }}>{errors.sub_heading[0]}</span>
                )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="content">
              Content:
            </label>
            <textarea
              id="content"
              name="content"
              value={data.content}
              rows="4"
              placeholder="Enter the content"
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
             {errors.content && (
                    <span style={{ color: "red" }}>{errors.content[0]}</span>
                )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="youtube">
              YouTube Link:
            </label>
            <input
              type="url"
              name="video_url"
              id="youtube"
              value={data.video_url}
              placeholder="Enter the YouTube link"
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="image">
              Upload Image (Optional):
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-gray-700 text-gray-400 rounded-lg border border-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-600 file:text-white hover:file:bg-gray-500"
            />
            {image
            
            
             && (
              <img
                src={image}
                alt="Uploaded preview"
                className="mt-4 rounded-lg w-full h-40 object-cover"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Save
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              onClick={()=>navigate(`/admin/content/${headingId}/${heading}`)}
            >
              back  
            </button>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4">What would you like to do?</h3>
            <p></p>
            <div className="flex justify-between">
              <button
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={handleformSave}
              
              >
                Save the changes
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                onClick=
                {()=>{setIsModalOpen(false)}}
              >
                cancel
              </button>
            </div>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={handleModalClose}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default EditContent;
