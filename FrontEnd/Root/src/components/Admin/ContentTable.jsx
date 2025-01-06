import React, { useEffect, useState } from 'react';
import { Edit, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { addlesson, deleteContent, deleteLesson, getContent, getlesson, updateLesson } from '../../actions/Lesson';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom';
function ContentTable() {
    const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState('');
  const auth = useSelector((select)=>select.auth)
  const [content,setContent] = useState([])
  const [state,setState] = useState(false)
  const [edit,setEdit] = useState('')
  const [id,setId] = useState(0)
  const params = useParams()
 const navigate = useNavigate()
  useEffect(()=>{
    async function fetchlessons() {
      const response = await getContent(auth.token,params.id)
      setContent(response.data.content)
    }
    fetchlessons()
  },[state])

  

  const handleDelete = async (id)=> {
    Swal.fire({
      title: "Do you want to Delete this content?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then( async (result) =>  {
      if (result.isConfirmed) {
        const response = await deleteContent(auth.token,id)
        Swal.fire("Deleted!", "", "success");
        setState(!state)
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
    
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="h-16 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-100">{params.heading}</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search contents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={ ()=>navigate(`/admin/Addcontent/${params.id}/${params.heading}`)}
            className="px-4 py-2 ml-4 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-900"
          >
            Add content
          </button>
        </div>
      </div>

     
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Contents
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {content.map((ls) => (
              <tr
                key={ls.id}
                className="hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {ls.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {ls.sub_heading}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={()=>navigate(`/admin/Editcontent/${params.id}/${ls.id}/${params.heading}`)}
                      className="p-1 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      <Edit size={16} className="text-gray-300 hover:text-gray-100" />
                    </button>
                    <button
                      onClick={()=>handleDelete(ls.id)}
                      className="p-1 hover:bg-gray-600 rounded-md transition-colors"
                    >
                      <Trash2 size={16} className="text-gray-300 hover:text-gray-100" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 border-t border-gray-700">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">Showing 1 to 10 of 10 entries</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              <ChevronLeft size={16} />
              Previous
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

     
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
    </div>
    
  )
}

export default ContentTable