import React, { useEffect, useState } from 'react';
import { Edit, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { addlesson, deleteLesson, getlesson, UpdatedOrder, updateLesson } from '../../actions/Lesson';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LessonTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState('');
  const auth = useSelector((select) => select.auth);
  const [lesson, setLesson] = useState([]);
  const [state, setState] = useState(false);
  const [edit, setEdit] = useState('');
  const [id, setId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLessons() {
      const response = await getlesson(auth.token);
      console.log(response);
      setLesson(response.data.lesson);
    }
    fetchLessons();
  }, [state]);

  const handleAddLesson = async () => {
    const response = await addlesson(newLesson, auth.token);
    console.log(response);

    if (response.status === 201) {
      toast.success('Successfully created!');
    } else {
      toast.error(response.response.data.errors.heading);
    }
    setIsModalOpen(false);
    setNewLesson('');
    setState(!state);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Do you want to Delete the topic?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteLesson(auth.token, id);
        Swal.fire("Deleted!", "", "success");
        setState(!state);
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleEditLesson = async () => {
    console.log(edit, id);

    const response = await updateLesson(auth.token, edit, id);
    console.log(response);
    if (response.status === 200) {
      toast.success('Successfully updated!');
    } else {
      toast.error(response.response.data.errors.heading);
    }
    setEdit('');
    setId(0);
    setState(!state);
  };

  const handleOnDragEnd = async (result) => {
    console.log(result,'sda');
    
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.index === destination.index) {
      return;
    }

    const reorderedLessons = Array.from(lesson);
    const [movedItem] = reorderedLessons.splice(source.index, 1);
    reorderedLessons.splice(destination.index, 0, movedItem);

    setLesson(reorderedLessons);
    console.log(reorderedLessons)
    
    const response = await UpdatedOrder(auth.token,reorderedLessons);
    if (response.status ==200) {
      toast.success('Order updated successfully!');
    } else {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="h-16 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-100">Lessons Management</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 ml-4 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-900"
          >
            Add Lesson
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="lessons" direction="vertical">
            {(provided) => (
              <table
                className="w-full"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <thead className="sticky top-0 bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Lessons
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {lesson.map((ls, index) => (
                    <Draggable key={ls.id} draggableId={String(ls.id)} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {ls.id}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-100"
                            onClick={() =>
                              navigate(`/admin/content/${ls.id}/${ls.heading}`)
                            }
                          >
                            {ls.heading}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => {
                                  setEdit(ls.heading);
                                  setId(ls.id);
                                }}
                                className="p-1 hover:bg-gray-600 rounded-md transition-colors"
                              >
                                <Edit size={16} className="text-gray-300 hover:text-gray-100" />
                              </button>
                              <button
                                onClick={() => handleDelete(ls.id)}
                                className="p-1 hover:bg-gray-600 rounded-md transition-colors"
                              >
                                <Trash2 size={16} className="text-gray-300 hover:text-gray-100" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 rounded-md p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Lesson</h2>
            <input
              type="text"
              value={newLesson}
              onChange={(e) => setNewLesson(e.target.value)}
              placeholder="Enter lesson heading..."
              className="w-full px-4 py-2 border border-gray-400 rounded-md mb-4 focus:outline-none focus:ring-2 text-gray-900 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-gray-100 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLesson}
                className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-900"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
       {edit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 rounded-md p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Lesson</h2>
            <input
              type="text"
              value={edit}
              onChange={(e) => setEdit(e.target.value)}
              placeholder="Enter lesson heading..."
              className="w-full px-4 py-2 border border-gray-400 rounded-md mb-4 focus:outline-none focus:ring-2 text-gray-900 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {setEdit(''),setEdit(0)}}
                className="px-4 py-2 bg-gray-500 text-gray-100 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditLesson}
                className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-900"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default LessonTable;
