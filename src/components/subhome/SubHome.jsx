import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { addForward, getDetailSymptomType, getListSymptomType,getNoneInteraction,getSearchSymptoms } from "../apis/api"
import { useMutation, useQuery } from 'react-query';

export default function SubHome() {
    const [selectedItems, setSelectedItems] = useState([]);

    const [listError,setListError] = useState([]);

    const [listSelectItems,setListSelectItems] = useState([]);

    const [searchItem,setSearchItem] = useState("");

    const [displaySearch,setDisPlaySearch] = useState(false);

    const [idSymptom,setIdSymptom] = useState(1);

    const [error,setError] = useState(null)

  const handleItemClick = (item) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);

    if (isSelected) {
      const updatedItems = selectedItems.filter((selectedItem) => selectedItem.id !== item.id);
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

    const [textHeader,setTextHeader] = useState("Hãy chọn triệu chứng của bạn")
   

    const getSymptomType = async()=>{
        return getListSymptomType();
    }

    const getListSymptomSearch = async()=>{
      return getSearchSymptoms(searchItem);
    }

    const listSymtompSearch = useQuery(`listSearch$${searchItem}`, getListSymptomSearch,{enabled:true})

    useEffect(()=>{
      listSymtompSearch.refetch()
    },[searchItem])

    const listSymptomType = useQuery("listSymptomType",getSymptomType,{
        enabled:true
    })

    const getSymptomTypeById = async()=>{
        return getDetailSymptomType(idSymptom);
    }

    const listSymptomTypeById = useQuery(`listSymptomTypeBy${idSymptom}`,getSymptomTypeById,{
        enabled:true
    })

    const confirmForwardMutation = useMutation(getNoneInteraction);

    const handleConfirm = (e)=>{
        e.preventDefault();
        
        const body={
            errors: listError,
            symptoms: listSelectItems.map((item)=>{
                return {id:item.id}
            })
        }

        confirmForwardMutation.mutate(body,{
            onSuccess:(response)=>{
              console.log("body",body)
              if(response.data.length>0){
                setError(response.data[0]);
                console.log("respone",response.data)
                
              }
            },
        onError:(err)=>{
            console.log(err)
        }
        })
    }

    const handleReset = ()=>{
        setSelectedItems([])
        setListSelectItems([])
        setSearchItem("")
        setError(null)
        setListError([])
      }

    

    


    useEffect(()=>{
        listSymptomTypeById.refetch()
    },[idSymptom])

    

    useEffect(()=>{
        listSymptomType.refetch()
    },[])

    
  return (
    <div>
    <div  className="d-flex my-5 mx-5"> 
      
      <h2 className='mx-5'>{textHeader}</h2>

      
    </div>
    <div className='d-flex justify-content-around '>
        {listSymptomType?.data?.data? (
            listSymptomType.data.data.map((item,index)=>(
                <div key={index}>
                <button type='button' className={item.id === idSymptom? 'btn btn-primary':'btn btn-secondary'}
                onClick={()=>{
                  setDisPlaySearch(false);
                  setIdSymptom(item.id)}}
                >{item.name}</button>
            </div>
            ))
            
        ):(<div />)}
      </div>
      
      <div className='d-flex mt-5 ' style={{height:400}}>
      
      <div  style={{width:600}}>
      <input
      style={{width:500,marginLeft:10}}
              value={searchItem}
              name='searchItem'
              placeholder='Tìm kiếm triệu chứng'
              onChange={(e)=>{
                setSearchItem(e.target.value)
                setDisPlaySearch(true);
              }}
            ></input>
            {
            displaySearch ? (
            listSymtompSearch.data? (
                <div style={{maxHeight:300,zIndex:100,overflowY:"auto",width:600, marginTop:20}}>
                    
                <ul style={{listStyle:"none"}}>
              {listSymtompSearch.data.data.map((item,index) => (
                <li key={index}
                onClick={() => handleItemClick(item)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedItems.some((selectedItem) => selectedItem.id === item.id)
                    ? 'lightblue'
                    : 'inherit',
                }}>{item.description}</li>
              ))}
            </ul>
              </div>
            ):(<div />)
            ):
            (
              listSymptomTypeById.data? (
                <div style={{maxHeight:300,zIndex:100,overflowY:"auto",width:600, marginTop:20}}>
                    
                <ul style={{listStyle:"none"}}>
              {listSymptomTypeById.data.data.symptoms.map((item,index) => (
                <li key={index}
                onClick={() => handleItemClick(item)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedItems.some((selectedItem) => selectedItem.id === item.id)
                    ? 'lightblue'
                    : 'inherit',
                }}>{item.description}</li>
              ))}
            </ul>
              </div>
            ):(<div />)
            )}

        
      
      </div>
      <div className='justify-content-center align-items-center' style={{width:800}}>
        
        
          {error ? (
        <h4>Có vẻ như xe bạn bị lỗi <span style={{color:"red"}}>{error.name}</span>. Dưới đây là thông tin lỗi, Hãy làm theo cách sửa dưới đây</h4>
      ) : (<div></div>)}
      {error? (
        <div className='d-flex mx-5'>
        <div className='w-50 h-100 mx-5'>
          <h5>Hình ảnh minh họa của lỗi</h5>
            <img src={error.linkImg} style={{width:200,height:150, objectFit:"contain"}}   />
        </div>
        <div>
        <div className='w-100  bg-opacity-75'>
            <h5>Các triệu chứng của lỗi {error.name}</h5>
            <div style={{maxHeight:150,zIndex:100,overflowY:"auto"}}>
                
            <ul>
          {error.relatedSymptoms.map((item,index) => (
            <li key={index}
            
            >{item.description}</li>
          ))}
        </ul>
          </div>
        </div>
        <div className='w-100 mt-5'>
            <h5>Cách sửa lỗi là : {error.repair}</h5>
        </div>
        </div>
      </div>
      ):(<div></div>)}
          
        
      
      

      
      </div>
      </div>

      <div style={{justifyContent:"space-between", display:"flex",marginLeft:50}}>
        <div style={{}}>
        <button type='button' className='btn btn-primary' onClick={()=>setListSelectItems(selectedItems)}>Add</button>
        <button type='button' className='btn btn-success mx-5' onClick={handleConfirm} >Confirm</button>
        </div>
        {error? <button type='button' className='btn btn-info' style={{marginRight:500}} onClick={handleReset} >OK</button>:(<div></div>)}
        
        </div>
        
      <div className='d-flex mb-5'>
        <div>
        <h4 className='mx-5'>Danh sách triệu chứng đã chọn</h4>
        {listSelectItems.length>0 && (
            <div 
            className='border border-2 rounded'
            style={{maxHeight:300,zIndex:100,overflowY:"auto",width:600}}> 
                <ul style={{listStyle:"none"}} >
              {listSelectItems.map((item,index) => (
                <li key={index}  style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}
                >{item.description}
                
                
                </li>
              ))}
            </ul>
          </div>
        )}
        
      </div>
      
      </div>
      
    </div>
  )
}
