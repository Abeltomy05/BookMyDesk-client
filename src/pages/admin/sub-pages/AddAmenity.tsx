import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X, Plus, Edit } from "lucide-react"
import toast from "react-hot-toast"

interface Amenity {
  _id: string;
  name: string;
  isActive: boolean;
}

interface AddAmenityFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
  onEdit?: (id: string, name: string) => Promise<void>
  editingAmenity?: Amenity | null
}

export function AddAmenityForm({ isOpen, onClose, onSubmit,  onEdit, editingAmenity = null }: AddAmenityFormProps) {
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!editingAmenity

  useEffect(() => {
    if (editingAmenity) {
      setName(editingAmenity.name)
    } else {
      setName("")
    }
  }, [editingAmenity])

   const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault() 
    if (!name.trim()){ 
      toast.error("Name cannot be empty."); 
      return; 
    } 
 
    setIsSubmitting(true) 
    try { 
      if (isEditing && editingAmenity && onEdit) {
        await onEdit(editingAmenity._id, name.trim())
      } else {
        await onSubmit(name.trim())
      }
      setName("") 
      onClose() 
    } catch (error) { 
      console.error(`Error ${isEditing ? 'editing' : 'adding'} amenity:`, error) 
    } finally { 
      setIsSubmitting(false) 
    } 
  } 

  const handleClose = () => {
    setName("")
    onClose()
  }

  if (!isOpen) return null

 return ( 
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"> 
      <motion.div 
        className="bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700" 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
      > 
        <div className="flex items-center justify-between mb-4"> 
          <h2 className="text-xl font-bold text-[#f69938]">
            {isEditing ? 'Edit Amenity' : 'Add New Amenity'}
          </h2> 
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors" 
          > 
            <X size={20} className="text-gray-400" /> 
          </button> 
        </div> 
 
        <form onSubmit={handleSubmit}> 
          <div className="mb-6"> 
            <label htmlFor="amenityName" className="block text-sm font-medium text-gray-300 mb-2"> 
              Amenity Name 
            </label> 
            <input 
              id="amenityName" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter amenity name..." 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f69938] focus:border-transparent text-white" 
              required 
            /> 
          </div> 
 
          <div className="flex gap-3"> 
            <button 
              type="button" 
              onClick={handleClose} 
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors" 
            > 
              Cancel 
            </button> 
            <button 
              type="submit" 
              disabled={!name.trim() || isSubmitting} 
              className="flex-1 px-4 py-2 bg-[#f69938] text-black rounded-lg hover:bg-[#e58a2f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2" 
            > 
              {isSubmitting ? ( 
                isEditing ? "Updating..." : "Adding..."
              ) : ( 
                <> 
                  {isEditing ? <Edit size={16} /> : <Plus size={16} />}
                  {isEditing ? 'Update' : 'Add'} Amenity 
                </> 
              )} 
            </button> 
          </div> 
        </form> 
      </motion.div> 
    </div> 
  ) 
}