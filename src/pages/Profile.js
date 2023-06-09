import React, { useState, useEffect } from 'react'
import Navbar from '../compnents/Navbar'
import Container from '../compnents/Container'
import Footer from '../compnents/Footer'
import { ImRocket } from 'react-icons/im'
import { MdOutlineCloudUpload } from 'react-icons/md'
import { useSelector, useDispatch } from 'react-redux'
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { getStorage, ref as iref, uploadString, getDownloadURL, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged, signOut, updateProfile, } from "firebase/auth";
import { userLoginInfo } from '../slices/userSlice';
import { useNavigate } from 'react-router-dom'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import moment from 'moment/moment';
import { BsThreeDots } from 'react-icons/bs'
import { BiEdit } from 'react-icons/bi'
import { GrClose } from 'react-icons/gr'
import Project from '../compnents/Project'
import FriendRequest from './../compnents/FriendRequest';
import Friend from '../compnents/Friend'

import { RotatingLines } from  'react-loader-spinner'
import {AiOutlineCloudUpload} from 'react-icons/ai'

const Profile = () => {
  const db = getDatabase();
  const auth = getAuth();
  let navigate = useNavigate()
  const storage = getStorage();
  let dispatch = useDispatch()
  let [coverList, setCoverList] = useState([])
  let [expriList, setExpriList] = useState([])
  let [eduiList, setEduiList] = useState([])
  let [titleList, setTitleList] = useState([])
  let [postlist, setPostList] = useState([])
  let data = useSelector((state) => state.userLoginInfo.userInformation)
  // let [verify, setVerify] = useState(false)
  let [modalShow, setModalshow] = useState(false)
  let [CoverImg, setCoverImg] = useState(null)
  let [expriImg, setExpriImg] = useState(null)
  let [eduImg, setEduImg] = useState(null)
  let [coverModalShow, setCoverModalShow] = useState(false)
  let [contactShow, setContactShow] = useState(false)
  let [titleModalShow, setTitleModalShow] = useState(false)
  let [titleChange, setTitleChange] = useState(false)
  let [aboutChange, setAboutChange] = useState('')
  let [id, setId] = useState('')
  let [titleValue, setTitleValue] = useState('')
  let [phoneValue, setPhoneValue] = useState('')
  let [phoneChaneModal, setPhoneChaneModal] = useState(false)
  let [expriChangeModal, setExpriChangeModal] = useState(false)
  let [expariValue, setExpariValue] = useState('')
  let [expariTitleValue, setExpariTitleValue] = useState('')
  let [eduModal, setEduModal] = useState(false)
  let [eduValue, setEduValue] = useState('')
  let [eduTitleValue, setEduTitleValue] = useState('')
  let [experienceTitleChange, setExperienceTitleChange] = useState('')
  let [schoolChange, setSchoolChange] = useState('')
  let [degreeChange, setDegreeChange] = useState('')
  let [loder, setLoader] = useState(false)
  let [expriShow, setExpriShow] = useState(false)
  let [eduShow, setEduShow] = useState(false)


  useEffect(() => {
    if (!data) {
      navigate('/login')
    }
  }, [])
  // useEffect(() => {
  //   if (data.emailVerified) {
  //     setVerify(true)
  //   }
  // }, [])

  onAuthStateChanged(auth, (user) => {
    // if(user.emailVerified){
    //   setVerify(true)
    // }
    dispatch(userLoginInfo(user))
    localStorage.setItem('userInformation', JSON.stringify(user))
  });


  const [image, setImage] = useState();
  const [cropData, setCropData] = useState('');
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoader(true)
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const message4 = cropper.getCroppedCanvas().toDataURL();
      const storageRef = iref(storage, auth.currentUser.uid);
      uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL
          }).then(() => {
            setModalshow(false)
            setLoader(false)
          })
        });
      });
    }
  };

  let coverImgInfo = (e) => {
    const storageRef = iref(storage,  e.target.files[0].name);
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        setCoverImg(downloadURL)
      });
    });
  }
  let coverImgSubmit = (e) => {
    set(ref(db, 'coverPhoto/' + data.uid), {
      coverimg: CoverImg,
      admin: data.displayName,
    }).then(() => {
      setCoverModalShow(false)
    })
  }
  let expriImgInfo = (e) => {
    const storageRef = iref(storage, e.target.files[0].name);
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        setExpriImg(downloadURL)
      });
    });
  }
  let handleExpriImgSubmit = (e) => {
    set(ref(db, 'exprianceimg/' + data.uid), {
      expriImg: expriImg,
      admin: data.displayName,
    }).then(() => {
      setExpriShow(false)
    })
  }
  let eduImgInfo = (e) => {
    const storageRef = iref(storage, e.target.files[0].name);
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        setEduImg(downloadURL)
      });
    });
  }
  let handleEduimgSubmit = (e) => {
    set(ref(db, 'eduimg/' + data.uid), {
      eduImg: eduImg,
      admin: data.displayName,
    }).then(() => {
      setEduShow(false)
    })
  }

  useEffect(() => {
    const starCountRef = ref(db, 'userInfo/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminid) {

          arr.push({ ...item.val(), id: item.key })
        }
      })
      setTitleList(arr)
    });
  }, [])

  useEffect(() => {
    const starCountRef = ref(db, 'coverPhoto/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {

        if (data.uid == item.key) {

          arr.push(item.val())
        }

      })
      setCoverList(arr)
    });
  }, [])
  useEffect(() => {
    const starCountRef = ref(db, 'exprianceimg/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {

        if (data.uid == item.key) {

          arr.push(item.val())
        }

      })
      setExpriList(arr)
    });
  }, [])
  useEffect(() => {
    const starCountRef = ref(db, 'eduimg/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {

        if (data.uid == item.key) {

          arr.push(item.val())
        }

      })
      setEduiList(arr)
    });
  }, [])

  useEffect(() => {
    const starCountRef = ref(db, 'post/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
        if (data.uid == item.val().adminid) {
          arr.push(item.val())

        }
      })
      setPostList(arr)
    });
  }, [])

  let handleTitleUpdate = () => {
    update(ref(db, 'userInfo/' + id), {
      about: aboutChange,
    }).then(() => {
      setTitleModalShow(false)
    })
  }
  let handelSetId = (item) => {
    setId(item.id)
    setTitleModalShow(true)
  }


  let handleTitleChange = (item) => {
    setId(item.id)
    setTitleChange(true)
  }
  let handleTitleChangeSubmit = () => {
    update(ref(db, 'userInfo/' + id),{
      title:titleValue,
    }).then(()=>{
      setTitleChange(false)
    })
  }
  let handlePhoneChangeModal = (item) => {
    setId(item.id)
    setPhoneChaneModal(true)
  }
  let handlePhoneChangeSubmit = () => {
    update(ref(db, 'userInfo/' + id),{
      phone:phoneValue,
    }).then(()=>{
      setPhoneChaneModal(false)
    })
  }
  let handleExpriModal = (item) => {
    setId(item.id)
    setExpriChangeModal(true)
  }
  let handleexpriSubmit = () => {
    update(ref(db, 'userInfo/' + id),{     
    experience:expariValue,
    experienceTitle:expariTitleValue,

    }).then(()=>{
      setExpriChangeModal(false)
    })
  }
  let handleEduModal = (item) => {
    setId(item.id)
    setEduModal(true)
  }
  let handleEduChangeSubmit = () => {
    update(ref(db, 'userInfo/' + id),{     
    degree:eduValue,
    schoolName:eduTitleValue,

    }).then(()=>{
      setEduModal(false)
    })
  }
 
  return (

    <>
      {coverModalShow
        ?
        (<div className='absolute top-0 left-0 bg-primary w-full h-full z-50 flex justify-center items-center'>
          <div className='w-full lg:w-2/4 p-10 bg-white rounded-bl-lg'>
            <h1 className='font-nunito text-2xl font-bold text-primary'>Upload Your Profile Photo </h1>
            <input onChange={coverImgInfo} className='font-nunito text-xl text-primary block mt-5 mb-5 w-full' type='file' />
            <img src={CoverImg} />
            <button onClick={coverImgSubmit} className='font-nunito py-3 px-5 bg-primary rounded-bl-lg text-xl text-white  mt-5 inline-block'>Upload</button>
            <button onClick={() => setCoverModalShow(false)} className='font-nunito py-3 px-5 bg-red-500 rounded-bl-lg text-xl text-white ml-5  mt-5 inline-block'>Cancel</button>
          </div>
        </div>)
        : modalShow ?
          (<div className='absolute top-0 left-0 bg-[rgba(0,0,0,.3)] w-full h-full z-50 flex justify-center items-center'>
            <div className='w-full lg:w-2/4 p-10 bg-white rounded-bl-lg'>
              <h1 className='font-nunito text-2xl font-bold text-primary'>Upload Your Profile Photo </h1>
              <input onChange={onChange} className='font-nunito text-xl text-primary block mt-5 w-full' type='file' />
              <div className='w-[60px] h-[60px] rounded-full overflow-hidden mx-auto mb-5'>
                {image ?
                  <div className="img-preview w-full h-full" />
                  :
                  <img className='w-full h-full' src="images/profile.png" alt="" />
                }
              </div>
              {image &&
                <div>
                  <Cropper
                    style={{ height: 400, width: "100%" }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                    guides={true}
                  />
                </div>
              }
              <div className='flex items-center'>
                {loder ?
               <RotatingLines
               strokeColor="grey"
               strokeWidth="5"
               animationDuration="0.75"
               width="96"
               visible={true}
             />
               :
              <button onClick={getCropData} className='font-nunito py-3 px-5 bg-primary rounded-bl-lg text-xl text-white  mt-5 inline-block'>Upload</button>
              }
              <button onClick={() => setModalshow(false)} className='font-nunito py-3 px-5 bg-red-500 rounded-bl-lg text-xl text-white ml-5  mt-5 inline-block'>Cancel</button>
              </div>
            </div>
          </div>)
          :
          (<>
            <Navbar />
            <Container>
              <div className='w-full lg:w-[800px] mx-auto'>
                <div className='group relative'>
                  <div className='w-full h-[180px]'>
                    {coverList.length == 0
                      ?
                      <img className='w-full h-full' src='images/profilecover.png' />
                      :
                      coverList.map((item) => (
                        <img className='w-full h-full' src={item.coverimg} />
                      ))
                    }
                  </div>
                  <div onClick={() => setCoverModalShow(true)} className='w-full h-[0%] group-hover:h-[100%] bg-[rgba(0,0,0,.5)]  absolute top-0 left-0  ease-in-out duration-300 flex justify-center items-center'>
                    <MdOutlineCloudUpload className='text-white text-2xl hidden group-hover:block' />
                  </div>
                </div>
                {/* profile and cover start */}
                <div className='flex flex-wrap justify-between gap-x-5'>
                  <div className='w-[100px] lg:w-[170px] h-[100px] lg:h-[170px] rounded-full overflow-hidden mt-[-20px] inline-block relative z-50 group'>
                    {data &&
                      <img className='w-full h-full' src={data.photoURL} />
                    }
                    <div onClick={() => setModalshow(true)} className='w-full h-[0%] group-hover:h-[100%] bg-[rgba(0,0,0,.5)]  absolute top-0 left-0  ease-in-out duration-300 flex justify-center items-center'>
                      <MdOutlineCloudUpload className='text-white text-2xl hidden group-hover:block' />
                    </div>
                  </div>
                  <div className='w-full lg:w-[75%] relative mt-6'>
                    {data &&
                      <h2 className='font-nunito font-bold text-3xl '>{data.displayName}</h2>
                    }
                    {titleList.map((item) => (
                      <div className='relative'>
                        <div >
                          <div>
                          <p className='font-nunito font-normal text-base mt-3 '>{item.title}</p>
                          <div onClick={() => handleTitleChange(item)} className='bg-[#dad5d5] border border-solid border-black p-1 flex gap-x-2  absolute top-[-5px] left-48 rounded-br-xl items-center hover:bg-primary hover:text-white ease-in-out duration-300' >
                                <span>Edit </span>
                                <BiEdit />
                              </div>
                          </div>
                          <div>
                            <p className='flex gap-x-2 items-center font-nunito font-medium text-base  absolute top-12 lg:top-2 right-0'><ImRocket />{item.addres}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button onClick={() => setContactShow(!contactShow)} className='font-nunito font-normal text-xl bg-[#0274AF] lg:w-[170px] py-2 px-2 lg:px-0 text-white rounded-md mt-3 mb-8'>Contact info</button>
                    {contactShow
                      &&
                      titleList.map((item) => (

                        <div className='relative'>
                          <h4 className='font-nunito font-medium text-xl text-primary'>Phone:{item.phone} </h4>
                          <h4 className='font-nunito font-medium text-xl text-primary mt-3'>Email: {item.email}</h4>
                          <div onClick={()=>handlePhoneChangeModal(item)}  className='bg-[#dad5d5] border border-solid border-black p-1 flex gap-x-2  absolute top-[-10px] right-0 rounded-br-xl items-center hover:bg-primary hover:text-white ease-in-out duration-300' >
                                <span>Edit </span>
                                <BiEdit />
                              </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* fsafhdsahdhf */}
                <div>
                  <ul class="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4" id="tabs-tabFill"
                    role="tablist">
                    <li class="nav-item flex-auto text-center" role="presentation">
                      <a href="#tabs-homeFill" class="
              nav-link
              w-full
              block
              font-bold
              text-xl
              leading-tight
              font-nunito
              border-x-0 border-t-0 border-b-2 border-transparent
              px-6
              py-3
              my-2
              hover:border-transparent hover:bg-gray-100
              focus:border-transparent
              active
            " id="tabs-home-tabFill" data-bs-toggle="pill" data-bs-target="#tabs-homeFill" role="tab"
                        aria-controls="tabs-homeFill" aria-selected="true">Profile</a>
                    </li>
                    <li class="nav-item flex-auto text-center" role="presentation">
                      <a href="#tabs-profileFill" class="
              nav-link
              w-full
              block
              font-bold
              text-xl
              leading-tight
              font-nunito
              border-x-0 border-t-0 border-b-2 border-transparent
              px-6
              py-3
              my-2
              hover:border-transparent hover:bg-gray-100
              focus:border-transparent
            " id="tabs-profile-tabFill" data-bs-toggle="pill" data-bs-target="#tabs-profileFill" role="tab"
                        aria-controls="tabs-profileFill" aria-selected="false">Friends</a>
                    </li>
                    <li class="nav-item flex-auto text-center" role="presentation">
                      <a href="#tabs-messagesFill" class="
              nav-link
              w-full
              block
              font-bold
              text-xl
              leading-tight
              font-nunito
              border-x-0 border-t-0 border-b-2 border-transparent
              px-6
              py-3
              my-2
              hover:border-transparent hover:bg-gray-100
              focus:border-transparent
            " id="tabs-messages-tabFill" data-bs-toggle="pill" data-bs-target="#tabs-messagesFill" role="tab"
                        aria-controls="friendrequestfill" aria-selected="false">Post</a>
                    </li>
                    <li class="nav-item flex-auto text-center" role="presentation">
                      <a href="#tabs-friendRequestFill" class="
              nav-link
              w-full
              block
              font-bold
              text-xl
              leading-tight
              font-nunito
              border-x-0 border-t-0 border-b-2 border-transparent
              px-6
              py-3
              my-2
              hover:border-transparent hover:bg-gray-100
              focus:border-transparent
            " id="tabs-friendRequest-tabFill" data-bs-toggle="pill" data-bs-target="#tabs-friendRequestFill" role="tab"
                        aria-controls="friendrequestfill" aria-selected="false">Friend Request</a>
                    </li>

                  </ul>
                  <div class="tab-content" id="tabs-tabContentFill">
                    <div class="tab-pane fade show active" id="tabs-homeFill" role="tabpanel" aria-labelledby="tabs-home-tabFill">
                      <div className='p-8 relative'>
                        <h4 className='font-nunito font-bold text-xl text-primary'>About</h4>
                        <div>
                          {titleList.map((item) => (
                            <div className='w-full' >
                              <p className='font-nunito w-auto text-md text-primary mt-3 break-all'>{item.about} </p>
                              <div onClick={() => handelSetId(item)} className='bg-[#dad5d5] border border-solid border-black p-1 flex gap-x-2  absolute top-8 left-32 rounded-br-xl items-center hover:bg-primary hover:text-white ease-in-out duration-300' >
                                <span>Edit </span>
                                <BiEdit />
                              </div>
                            </div>
                          ))}
                             {titleModalShow &&
                            <div className='absolute top-[-150px] right-0 w-full lg:w-2/4 p-5  border border-solid border-black z-50 bg-white rounded-md'>
                              <div className='bg-white '>
                                <h1 className='font-nunito font-bold text-2xl mb-5'>Update BIO </h1>
                                {titleList.map((item) => (
                                  <input onChange={(e) => setAboutChange(e.target.value)} className='border border-solid border-black rounded-md w-full py-3 px-5 mb-5' defaultValue={item.about} />

                                ))}
                                <button onClick={handleTitleUpdate} className='bg-primary text-xl font-nunito p-3 text-white rounded-md'>Update</button>
                                <button onClick={() => setTitleModalShow(false)} className='bg-red-500 text-xl font-nunito p-3 text-white rounded-md ml-2'>Cancle</button>

                              </div>
                            </div>
                          }
                        </div>
                        
                      </div>
                    </div>
                    <div class="tab-pane fade" id="tabs-profileFill" role="tabpanel" aria-labelledby="tabs-profile-tabFill">
                      <div className='p-8'>
                        <Friend />
                      </div>
                    </div>
                    <div class="tab-pane fade" id="tabs-messagesFill" role="tabpanel" aria-labelledby="tabs-profile-tabFill">
                      {postlist.length==0
                      ?
                      <h3 className='bg-red-500 text-white font-bold text-xl font-nunito px-5 py-2'>No Post Available</h3>
                      :
                      postlist.map((item) => (
                        <div>
                          <div className='flex items-center gap-x-4 pt-14 pb-4 relative '>
                            <img className='w-[60px] h-[60px] rounded-full overflow-hidden' src={data.photoURL} />
                            <div>
                              <h4 className='font-nunito text-lg font-bold text-primary '>{item.admin}</h4>

                              {titleList.map((item) => (
                                <p className='font-nunito text-xs font-normal text-primary '>{item.title}</p>

                              ))}
                              <p className='font-nunito font-normal text-xs mt-2 text-[#D7D7D7]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                            </div>
                            <BsThreeDots className='absolute top-8 right-0' />
                          </div>
                          <div className='mb-16'>
                            <h1 className='font-nunito text-2xl font-bold text-[#181818] mb-3'>{item.post}</h1>
                            <img src={item.img} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div class="tab-pane fade" id="tabs-friendRequestFill" role="tabpanel" aria-labelledby="tabs-profile-tabFill">
                      <div className='p-8'>
                        {/* <h4 className='font-nunito font-bold text-xl text-primary'>No Friend available</h4> */}
                        <FriendRequest />
                      </div>
                    </div>

                  </div>
                </div>
                {/* fsafhdsahdhf */}
                <Project />
                {/* experience start */}
                <div className='mt-10'>
                  <h3 className='font-nunito text-lg font-bold text-primary mb-5'>Experience</h3>
                  <div className='flex gap-x-5 items-center'>
                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden relative group'>
                    {expriList.length==0
                    ?
                    <img className='w-full' src='images/icon1.png' />
                    :
                    expriList.map((item)=>(
                      <img className='w-full' src={item.expriImg} />
                    ))
                    }
                      <div onClick={()=>setExpriShow(true)} className='w-full h-0 group-hover:h-full ease-in-out duration-300 bg-[rgba(0,0,0,.6)]  absolute
                       top-0 left-0 flex justify-center items-center '>
                        <AiOutlineCloudUpload className='hidden group-hover:flex text-white text-2xl'/>
                       </div>
                    </div>
                    <div className='w-[88%] relative'>
                      {titleList.map((item) => (
                        <div className='relative'>
                          <h3 className='font-nunito text-xl font-bold text-primary mb-1'>{item.experience}</h3>
                          <h5 className='font-nunito text-lg font-medium text-primary mb-3'>{item.experienceTitle}</h5>

                      <div onClick={()=>handleExpriModal(item)} className='bg-[#dad5d5] border border-solid border-black p-1 flex gap-x-2  absolute top-[-50px] left-10 rounded-br-xl items-center hover:bg-primary hover:text-white ease-in-out duration-300' >
                                <span>Edit </span>
                                <BiEdit />
                              </div>
                        </div>
                      ))}
                        {expriChangeModal &&
                        <div className='absolute top-[-50px] right-0 w-full lg:w-[350px] p-5  border border-solid border-black z-50 bg-white rounded-md'>
                          <div className='bg-white '>
                            <h1 className='font-nunito font-bold text-2xl mb-5'>Update Experience </h1>
                            {titleList.map((item) => (
                          <div>
                                    <input onChange={(e) => setExpariValue(e.target.value)} className='border border-solid border-black rounded-md w-full py-3 px-5 mb-5' defaultValue={item.experience} />
                                  <input onChange={(e) => setExpariTitleValue(e.target.value)} className='border border-solid border-black rounded-md w-full py-3 px-5 mb-5' defaultValue={item.experienceTitle} />

                          </div>
                            ))}
                            <button onClick={handleexpriSubmit}  className='bg-primary text-xl font-nunito p-3 text-white rounded-md'>Update</button>
                            <button onClick={() => setExpriChangeModal(false)} className='bg-red-500 text-xl font-nunito p-3 text-white rounded-md ml-2'>Cancle</button>

                          </div>
                        </div>
                          }

                    </div>
                  </div>
                </div>
                {/* experience start */}
                <div className='mt-12 mb-12'>
                  <h3 className='font-nunito text-lg font-bold text-primary mb-5'>Education</h3>
                  <div className='flex gap-x-5'>
                  <div className='w-[70px] h-[70px] rounded-full overflow-hidden relative group'>
                    {eduiList.length==0
                    ?
                    <img className='w-full' src='images/icon1.png' />
                    :
                    eduiList.map((item)=>(
                      <img className='w-full' src={item.eduImg} />
                    ))
                    }
                  
                      <div onClick={()=>setEduShow(true)} className='w-full h-0 group-hover:h-full ease-in-out duration-300 bg-[rgba(0,0,0,.6)]  absolute
                       top-0 left-0 flex justify-center items-center '>
                        <AiOutlineCloudUpload className='hidden group-hover:flex text-white text-2xl'/>
                       </div>
                    </div>
                    <div className='w-[88%] relative'>
                      {titleList.map((item) => (
                        <div className='relative'>

                          <h3 className='font-nunito text-xl font-bold text-primary mb-1'>{item.schoolName}</h3>
                          <h5 className='font-nunito text-lg font-medium text-primary mb-3'>{item.degree}</h5>
                          
                      <div onClick={()=>handleEduModal(item)} className='bg-[#dad5d5] border border-solid border-black p-1 flex gap-x-2  absolute top-[-50px] left-10 rounded-br-xl items-center hover:bg-primary hover:text-white ease-in-out duration-300' >
                                <span>Edit </span>
                                <BiEdit />
                              </div>
                        </div>
                      ))}
                         {eduModal &&
                        <div className='absolute top-[-50px] right-0 w-full lg:w-[350px] p-5  border border-solid border-black z-50 bg-white rounded-md'>
                          <div className='bg-white '>
                            <h1 className='font-nunito font-bold text-2xl mb-5'>Update Education </h1>
                            {titleList.map((item) => (
                          <div>
                                    <input onChange={(e) => setEduValue(e.target.value)} className='border border-solid border-black rounded-md w-full py-3 px-5 mb-5' defaultValue={item.degree} />
                                  <input onChange={(e) => setEduTitleValue(e.target.value)} className='border border-solid border-black rounded-md w-full py-3 px-5 mb-5' defaultValue={item.schoolName} />

                          </div>
                            ))}
                            <button onClick={handleEduChangeSubmit}  className='bg-primary text-xl font-nunito p-3 text-white rounded-md'>Update</button>
                            <button onClick={() => setEduModal(false)} className='bg-red-500 text-xl font-nunito p-3 text-white rounded-md ml-2'>Cancle</button>

                          </div>
                        </div>
                          }

                    </div>
                  </div>
                </div>
              </div>
              <Footer />
            </Container>
          </>)
      }
      {/* modal title start  */}
   
      {phoneChaneModal &&
        <div className='absolute top-40 left-[50%] translate-x-[-50%] w-full lg:w-1/4 p-5  border border-solid border-black z-50 bg-white rounded-md'>
          <div className='bg-white '>
            <h1 className='font-nunito font-bold text-2xl mb-5'>Update Phone </h1>
            {titleList.map((item) => (
              <input onChange={(e) => setPhoneValue(e.target.value)} className='border border-solid border-black rounded-md w-full py-3 px-5 mb-5' defaultValue={item.phone} />

            ))}
            <button onClick={handlePhoneChangeSubmit} className='bg-primary text-xl font-nunito p-3 text-white rounded-md'>Update</button>
            <button onClick={() => setPhoneChaneModal(false)} className='bg-red-500 text-xl font-nunito p-3 text-white rounded-md ml-2'>Cancle</button>

          </div>
        </div>
      }
    
      {/* modal title end */}
      {titleChange &&
       <div className='absolute top-40 left-[50%] translate-x-[-50%] w-full lg:w-1/4 p-5  border border-solid border-black z-50 bg-white rounded-md'>
       <div className='bg-white '>
         <h1 className='font-nunito font-bold text-2xl mb-5'>Update Title </h1>
         {titleList.map((item) => (
           <input onChange={(e)=>setTitleValue(e.target.value)} className='border border-solid border-black rounded-md w-full py-3 px-5 mb-5' defaultValue={item.title} />

         ))}
         <button onClick={handleTitleChangeSubmit} className='bg-primary text-xl font-nunito p-3 text-white rounded-md'>Update</button>
         <button onClick={()=>setTitleChange(false)}  className='bg-red-500 text-xl font-nunito p-3 text-white rounded-md ml-2'>Cancle</button>

       </div>
     </div>
      }
      {expriShow &&
      <div className='w-full h-full bg-[rgba(0,0,0,.6)] absolute z-50
       top-0 left-0 flex justify-center items-center'>
         <div className='w-2/4 p-10 bg-white rounded-bl-lg'>
            <h1 className='font-nunito text-2xl font-bold text-primary'>Upload Your Experiance Image</h1>
            <input onChange={expriImgInfo} className='font-nunito text-xl text-primary block mt-5 mb-5' type='file' />
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            {expriImg?
            <img  src={expriImg} />
            :
            <img src='images/icon1.png' />
            }

            </div>
            <button onClick={handleExpriImgSubmit}  className='font-nunito py-3 px-5 bg-primary rounded-bl-lg text-xl text-white  mt-5 inline-block'>Upload</button>
            <button onClick={() => setExpriShow(false)} className='font-nunito py-3 px-5 bg-red-500 rounded-bl-lg text-xl text-white ml-5  mt-5 inline-block'>Cancel</button>
          </div>
      </div>
        }
      {eduShow &&
      <div className='w-full h-full bg-[rgba(0,0,0,.6)] absolute z-50
       top-0 left-0 flex justify-center items-center'>
         <div className='w-2/4 p-10 bg-white rounded-bl-lg'>
            <h1 className='font-nunito text-2xl font-bold text-primary'>Upload Your Education Image</h1>
            <input onChange={eduImgInfo} className='font-nunito text-xl text-primary block mt-5 mb-5' type='file' />
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            {eduImg?
            <img  src={eduImg} />
            :
            <img src='images/icon1.png' />
            }

            </div>
            <button onClick={handleEduimgSubmit}  className='font-nunito py-3 px-5 bg-primary rounded-bl-lg text-xl text-white  mt-5 inline-block'>Upload</button>
            <button onClick={() => setEduShow(false)} className='font-nunito py-3 px-5 bg-red-500 rounded-bl-lg text-xl text-white ml-5  mt-5 inline-block'>Cancel</button>
          </div>
      </div>
        }
    </>
  )
}

export default Profile