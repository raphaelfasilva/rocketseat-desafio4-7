const fs = require("fs")
const data = require('../data')
const { date } = require('../util')
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("por favor validar todos os campos")
        }
    }
    let { avatar_url, birth, name, email, schoolyear, hours } = req.body
    birth = Date.parse(birth)
    const id = Number(data.students.length + 1)
    data.students.push({
        id,
        avatar_url,
        name,
        birth,
        email,
        schoolyear,
        hours
    })
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("erro gravar no arquivo")
        return res.redirect(`/students/${id}`)
    })
}
exports.show = function(req, res) {
    const { id } = req.params
    const foundstudents = data.students.find(function(students) {
        return students.id == id
    })
    if (!foundstudents) {
        res.send("professor não encontrado")
    }
    const student = {
        ...foundstudents,
        birth: date(foundstudents.birth).birthday

    }
    return res.render("students/show", { student })
}

exports.edit = function(req, res) {
    const { id } = req.params
    const foundstudents = data.students.find(function(students) {
        return students.id == id
    })
    if (!foundstudents) {
        res.send("professor não encontrado")
    }
    const student = {
        ...foundstudents,
        birth: date(foundstudents.birth).iso
    }
    return res.render("students/edit", { student })
}
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0
    const foundstudents = data.students.find(function(student, foundIndex) {
        if (id == student.id) {
            index = foundIndex
            return true
        }
    })
    if (!foundstudents) {
        res.send("instrutor não encontrado")
    }
    const student = {
        ...foundstudents,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }
    data.students[index] = student
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("erro gravar no arquivo")
        return res.redirect(`/students/${id}`)
    })

}
exports.delete = function(req, res) {
    const { id } = req.body
    const filteredstudents = data.students.filter(function(student) {
        return student.id != id
    })
    data.students = filteredstudents
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("erro gravar no arquivo")
        return res.redirect(`/students`)
    })

}
exports.index = function(req, res) {

    return res.render("students/index", { students: data.students })
}