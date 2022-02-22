

import React, { useEffect, useRef, useState } from 'react'
import { useAlert } from 'react-alert'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Career.css"
import processImg from '../helpers/process-image'
import moment from 'moment';
import swal from 'sweetalert';

import { Button, Col, Container, Form, Nav, Row, Table, Image, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { BASE_URL } from '../constants';


function Career() {
    const alert = useAlert()

    const ref = useRef()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobileCode, setMobileCode] = useState('')
    const [mobile, setMobile] = useState('')
    const [userJobType, setUserJobType] = useState('')
    const [dob, setDob] = useState('')
    const [loc, setLoc] = useState('')
    const [imgBase64, setImgBase64] = useState('https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg')

    const [tableData, setTableData] = useState([])

    const [flag, setFlag] = useState(true)
    const [editId, setEditId] = useState('')


    useEffect(() => {
        try {
            (async () => {
                const response = await axios.get(`${BASE_URL}/api/form-data`)
                console.log('test')
                console.log(response.data)
                setTableData(response.data)
            })()
        } catch (error) {
            console.log(error);
        }
    }, [flag])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !name.length
            || !email.length
            || !mobileCode.toString().length
            || !mobile.toString().length
            || !userJobType.length
            || !dob.length
            || !loc.length
            || !imgBase64.length
        ) {
            alert.show('Please fill the form')
            return;
        }
        if (
            mobileCode.toString().length > 5
        ) {
            alert.show('Invalid mobile code')
            return;
        }
        if (
            mobile.toString().length !== 10

        ) {
            alert.show('Invalid mobile number')
            return;
        }
        if ((imgBase64.substring(0, 22) !== 'data:image/png;base64,') && !editId.length) {
            alert.show('Image field is empty')
            return
        }

        try {

            const postData = {
                name, email, mobileCode, mobile, userJobType, dob, loc, imgBase64
            }

            console.log(postData);

            if ((imgBase64.substring(0, 22) !== 'data:image/png;base64,')) {
                delete postData.imgBase64
            }

            console.log(postData);

            if (editId.length) {
                const response = await axios.put(`${BASE_URL}/api/submit?id=${editId}`, postData)
                if (!response) {
                    alert.show('Err')
                    return
                }
                alert.success(response.data.msg)
                setFlag(!flag)


            } else {
                const response = await axios.post(`${BASE_URL}/api/submit`, postData)
                if (!response) {
                    alert.show('Err')
                    return
                }
                alert.success(response.data.msg)
                setFlag(!flag)

            }

            setName('')
            setEmail('')
            setMobileCode('')
            setMobile('')
            setUserJobType('')
            setDob('')
            setLoc('')
            setImgBase64('https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg')
            ref.current.value = ''

        } catch (error) {
            alert.show(error);
        }
    }

    const handleReset = () => {
        setName('')
        setEmail('')
        setMobileCode('')
        setMobile('')
        setUserJobType('')
        setDob('')
        setLoc('')
        setImgBase64('https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg')
        ref.current.value = ''
        setEditId('')
    }

    const handleEdit = async (id) => {
        const response = await axios.get(`${BASE_URL}/api/form-data?id=${id}`)

        setName(response.data.name)
        setEmail(response.data.email)
        setMobileCode(response.data.mobileCode)
        setMobile(response.data.mobile)
        setUserJobType(response.data.userJobType)
        setDob(await formatDate(new Date(response.data.dob)))
        setLoc(response.data.loc)
        setImgBase64(`${BASE_URL}/images/${response.data.pic}`)
        setEditId(response.data._id);
    }
    const handleDelete = async (id) => {
        const c = await swal({
            title: "Are you sure?",
            text: "Are you sure want to delete the data?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
        if (!c) {
            return
        }
        try {
            const response = await axios.delete(`${BASE_URL}/api/form-data?id=${id}`)
            console.log('delete');
            console.log(response.data);

        } catch (error) {
            alert.show(error)
        }
        setFlag(!flag)
        alert.success('item deleted successfully')
    }

    const allJobs = [
        { name: 'FT', value: 'Full Time' },
        { name: 'PT', value: 'Part Time' },
        { name: 'Consultant', value: 'Consultant' }
    ];
    const prefLoc = ["Chennai", "Bangalore", "Pune"];


    const formatDate = (newDate) => {

        let month = newDate.getMonth() + 1;
        let dayDate = newDate.getDate();

        if (month.toString().length === 1) {
            month = `0${month}`
        }
        if (dayDate.toString().length === 1) {
            dayDate = `0${dayDate}`
        }

        return newDate.getFullYear() + "-" + month + "-" + dayDate;
    }

    return (

        <Container>
            <Row className='form-row position-relative'>
                <Form id='form' className='mt-5 mb-5 p-5 border border-2 rounded' onSubmit={handleSubmit}>
                    <Row className='d-flex'>
                        <Col className='m-2 d-flex'>
                            <Col md="auto" className='d-flex flex-column justify-content-evenly'>
                                <Form.Label className='text-nowrap mb-4'>Fullname</Form.Label>
                                <Form.Label className='text-nowrap mb-4'>Mobile</Form.Label>
                                <Form.Label className='text-nowrap mb-4'>Job Type</Form.Label>

                            </Col>
                            <Col className='d-flex flex-column justify-content-evenly'>
                                <Form.Control className='input-box ms-3 mb-4' onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Enter Name" />
                                <Col className='d-flex mb-4 ms-3 align-items-center'>
                                    <Col md="2" className='d-flex border rounded my-auto me-2 justify-content-center align-items-center'>
                                        <span className='h5 text-muted m-1 p-0'>+</span>
                                        <input className='col-6 border-0' onChange={(e) => setMobileCode(e.target.value)} value={mobileCode} type="number" />
                                    </Col>
                                    <Form.Control className='input-box' type="number" onChange={(e) => setMobile(e.target.value)} value={mobile} style={{ height: "fit-content" }} placeholder="Enter Mobile" />
                                </Col>

                                <ButtonGroup className='ms-3 mb-4'>
                                    {allJobs.map((job, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant='outline-success'
                                            name="radio"
                                            value={job.value}
                                            checked={userJobType === job.value}
                                            onChange={(e) => setUserJobType(e.currentTarget.value)}
                                        >
                                            {job.name}
                                        </ToggleButton>
                                    ))}
                                </ButtonGroup>

                            </Col>
                        </Col>
                        <Col className='m-2 d-flex'>
                            <Col md="auto" className='d-flex flex-column justify-content-evenly'>
                                <Form.Label className='text-nowrap mb-4'>Profile Pic</Form.Label>
                                <Form.Label className='text-nowrap mb-4'>Email Id</Form.Label>
                                <Form.Label className='text-nowrap mb-4'>DOB</Form.Label>
                            </Col>
                            <Col className='d-flex flex-column justify-content-evenly'>
                                <Col className='ms-3 mb-4 d-flex align-items-center'>
                                    <Image className='border' width="75px" height="50px" style={{ objectFit: "cover" }}
                                        src={imgBase64}
                                        rounded
                                        alt=''
                                    />
                                    <Form.Control className='input-box ms-3' ref={ref} onChange={async (e) => setImgBase64(await processImg(e.target.files[0]))} type="file" placeholder="" />
                                </Col>
                                <Form.Control className='input-box ms-3 mb-4' onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Enter email" />
                                <Form.Control className='input-box ms-3 mb-4' onChange={(e) => setDob(e.target.value)} value={dob} type="date" max={formatDate(new Date())} placeholder="" />
                            </Col>
                        </Col>
                    </Row>
                    <Row >
                        <Col className='d-flex justify-content-between mt-3'>
                            <Form.Group className="d-flex align-items-center" controlId="formBasicEmail">
                                <Form.Label className='text-nowrap'>Pref. Location:</Form.Label>
                                <Col className='ms-3'>
                                    <div key={`inline-radio`}>
                                        {
                                            prefLoc.map((pLoc, key) => (
                                                <Form.Check
                                                    key={key}
                                                    inline
                                                    label={pLoc}
                                                    name="prefLoc"
                                                    type="radio"
                                                    checked={pLoc === loc}
                                                    onChange={() => setLoc(pLoc)}
                                                    id={`${pLoc}`}
                                                />

                                            ))
                                        }
                                    </div>
                                </Col>

                            </Form.Group>
                            <div className='d-flex justify-content-end'>
                                <Button className='m-1' onClick={handleReset} variant="light" type="reset">reset</Button>
                                <Button className='m-1' variant="primary" type="submit">+ Add / Update</Button>
                            </div>

                        </Col>

                    </Row>
                </Form>
            </Row>
            <Row className='mb-5'>
                <Table striped bordered hover className='mt-5'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>DOB</th>
                            <th>Job Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableData.map(({ _id, name, email, mobile, mobileCode, dob, userJobType, pic }, key) =>

                                <tr key={key}>
                                    <td>1</td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>{`+${mobileCode} ${mobile}`}</td>
                                    <td>{moment(formatDate(new Date(dob))).format("MMM Do YY")}</td>
                                    <td>{userJobType}</td>
                                    <td className='d-flex'>
                                        <Image key={key} width="50px" height="50px" style={{ objectFit: "cover" }}
                                            src=
                                            {`${BASE_URL}/images/${pic}`}
                                            roundedCircle
                                        />
                                        <Nav.Link onClick={() => handleEdit(_id)} href="#form">Edit</Nav.Link>
                                        <Nav.Link className='text-danger' onClick={() => handleDelete(_id)} href="#form">Delete</Nav.Link>
                                    </td>
                                </tr>

                            )

                        }
                    </tbody>
                </Table>
            </Row>
        </Container>

    )
}

export default Career