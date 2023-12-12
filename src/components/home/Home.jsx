import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { addForward, getDetailSymptomType, getListSymptomType,getSearchSymptoms } from "../apis/api"
import { useMutation, useQuery } from 'react-query';

export default function Home() {
    const [selectedItems, setSelectedItems] = useState([]);

    const [listError,setListError] = useState([]);

    const [listSelectItems,setListSelectItems] = useState([]);

    const [listData, setListData] = useState([]);

    const [deleteDisplay,setDeleteDisplay] = useState(true);

    const [searchItem,setSearchItem] = useState("");

    const [displaySearch,setDisPlaySearch] = useState(false);

    const [idSymptom,setIdSymptom] = useState(1);

    const [index,setIndex] = useState(0);

    const [error,setError] = useState(null)

    const [symptom,setSymptom]= useState(null);

    const [finalResult,setFinalResult] = useState(false);

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

    const confirmForwardMutation = useMutation(addForward);

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
                setError(null)
                setIndex(0);

                setDeleteDisplay(false);
                setListData(response.data);
                console.log("respone",response.data)
                handleError(response.data,0)
              }
            },
        onError:(err)=>{
            console.log(err)
        }
        })
    }

    const handleError = useCallback((item,index)=>{

        for(let i = index;i<item.length;i++){
          const numFlag = item[i].relatedSymptoms.filter(obj=>obj.flag===1).length;

          if(numFlag/item[i].relatedSymptoms.length>=0.7){
            console.log('first', JSON.stringify(item[i], null, 2))
            setError(item[i])
            return;
          }
          else {
            
            const firstFlagSymptom = item[i].relatedSymptoms.find(obj=>obj.flag===0 &&obj.flagDone===0);
            if(firstFlagSymptom){
              console.log("firstFlagSymptom",firstFlagSymptom)
            setSymptom(firstFlagSymptom);
            return;
            }
            else 
            {
              if(index===item.length-1)
              {setFinalResult(true);
                 return}
              else 
              {
                setIndex(prev=>prev+1)
            return
              }
            }
          }
        }
      },[]
    )

    useEffect(()=>{
      // console.log("listData",listData)
      handleError(listData,index)
    },[listData,index])

    const handleClick =()=>{
      handleOk(symptom);
    }

    const handleClickNo = ()=>{
      console.log("handleClickNo")
      if(listData[index].relatedSymptoms[listData[index].relatedSymptoms.length-1].id !== symptom.id){
      handleNo(symptom)
      }
      else {
        if(listData.length-1 ===index) setFinalResult(true)
        else
        setIndex(prev => prev+1)
      }
    }


    const handleOk = (props)=>{
      if(listData&& listData.length>0){
        // console.log("prop",props)
        console.log("listDAta",listData)
      const tmp = listData.map((item)=>{
        const data = item.relatedSymptoms.map(obj=>{
          
          if(obj.id===props.id){
            return {...obj,flag:1,flagDone:1}
          }
          
          return obj;
        })
        if(data) return {...item, relatedSymptoms:data};
        return item;
      })
      // console.log("tmp",tmp)
      
      setListData(tmp)
      }
    }

    const handleReset = ()=>{
      setDeleteDisplay(false);
      setListData([])
      setSelectedItems([])
      setListSelectItems([])
      setSearchItem("")
      setError(null)
      setListError([])
      setIndex(0)
      setSymptom(null)
      setFinalResult(false)
    }

    const handleNo = (props)=>{
      if(listData&& listData.length>0){
        // console.log("prop",props)
      const tmp = listData.map((item)=>{
        const data = item.relatedSymptoms.map(obj=>{
          
          if(obj.id===props.id){
            return {...obj,flagDone:1}
          }
          
          return obj;
        })
        if(data) return {...item, relatedSymptoms:data};
        return item;
      })
      // console.log("tmp",tmp)
      
      setListData(tmp)
      }
    }

    const handleNextError = ()=>{
      setListError([...listError,{"id":error.id}])
      setError(null)
      setIndex(prev => prev+1)
    }

    const handleDelete = (id)=>{
      const tmp = listSelectItems.filter((item)=>item.id !==id)
      setListSelectItems(tmp)
    }


    useEffect(()=>{
        listSymptomTypeById.refetch()
    },[idSymptom])

    

    useEffect(()=>{
        listSymptomType.refetch()
    },[])

    

    // console.log(error)

    
  return (
    <div>
    <div  className="d-flex my-5 mx-5"> 
      <button type="button" className="btn btn-warning">Reset</button>
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
        {finalResult? (
        <div>
        <h5>Lỗi của bạn nằm ngoài tri thức của hệ thống</h5>
        <button type='button' className='btn btn-success mx-3' style={{width:80,height:50}} onClick={handleReset}>OK</button>
        </div>
        ):(
          <>
          {error? (
        <h4>Có vẻ như xe bạn bị lỗi <span style={{color:"red"}}>{error.name}</span>. Dưới đây là thông tin lỗi, Hãy làm theo cách sửa dưới đây</h4>
      ):symptom?(
        <div className='d-flex justify-content-center mb-2' style={{width:800}}>
          <h4>Hãy cho tôi biết bạn có cảm thấy <span style={{color:"red"}}>{symptom.description}</span> không ?</h4>
          <button type='button' className='btn btn-success mx-3' style={{width:80,height:50}} onClick={handleClick}>Có</button>

          <button type='button' className='btn btn-danger' style={{width:80,height:50}} onClick={handleClickNo}>Không</button>
        </div>
      ):""}
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
      ) : (<div></div>)}
          </>
        )}
      
      

      
      </div>
      </div>
      <div className='d-flex justify-content-around'>
        <div>
        <button type='button' className='btn btn-primary' onClick={()=>setListSelectItems(selectedItems)}>Add</button>
        <button type='button' className='btn btn-success mx-5' onClick={handleConfirm} >Confirm</button>
        
        </div>
        
         {error ? (
          <div>
          <button type='button' className='btn btn-success' onClick={handleReset}>OK</button>
          <button type='button' className='btn btn-info mx-5' onClick={()=>{
            setDeleteDisplay(true)
            
            setListError([...listError,{"id":error.id}])
          }
          }>Giảm bớt triệu chứng</button>
          {listData.length>0 && listData.length>=index && (
            <button type='button' className='btn btn-warning' onClick={handleNextError}>Kiểm tra lỗi tiếp theo</button>
          )}
          
          </div>
         ):(<div></div>)}
        
       
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
                {deleteDisplay ? (
                  <button type='button' className='btn btn-danger'  style={{height:40,margin:5}}
                  onClick={()=>handleDelete(item.id)}
                  >X</button>
                ): (<div></div>)}
                
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
