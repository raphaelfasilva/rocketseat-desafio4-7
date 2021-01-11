const fs = require("fs")
const data = require('../data')
const { age } = require('../util')
const { date } = require('../util')
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "") {
            return res.send("por favor validar todos os campos")
        }
    }
    let { avatar_url, birth, name, degree, gender, typeofclass, areas } = req.body
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.teachers.length + 1)
    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        degree,
        areas,
        typeofclass,
        created_at,
    })
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("erro gravar no arquivo")
        return res.redirect(`/teachers/${id}`)
    })
}
exports.show = function(req, res) {
    const { id } = req.params
    const foundTeachers = data.teachers.find(function(teachers) {
        return teachers.id == id
    })
    if (!foundTeachers) {
        res.send("professor não encontrado")
    }
    const teacher = {
        ...foundTeachers,
        age: age(foundTeachers.birth),
        areas: foundTeachers.areas.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeachers.created_at),

    }
    return res.render("teachers/show", { teacher })
}

exports.edit = function(req, res) {
    const { id } = req.params
    const foundTeachers = data.teachers.find(function(teachers) {
        return teachers.id == id
    })
    if (!foundTeachers) {
        res.send("professor não encontrado")
    }
    const teacher = {
        ...foundTeachers,
        birth: date(foundTeachers.birth).iso
    }
    return res.render("teachers/edit", { teacher })
}
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0
    const foundTeachers = data.teachers.find(function(teacher, foundIndex) {
        if (id == teacher.id) {
            index = foundIndex
            return true
        }
    })
    if (!foundTeachers) {
        res.send("instrutor não encontrado")
    }
    const teacher = {
        ...foundTeachers,
        ...req.body,
        birth: Date.parse(req.body.birth)
    }
    data.teachers[index] = teacher
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("erro gravar no arquivo")
        return res.redirect(`/teachers/${id}`)
    })

}
exports.delete = function(req, res) {
    const { id } = req.body
    const filteredTeachers = data.teachers.filter(function(teacher) {
        return teacher.id != id
    })
    data.teachers = filteredTeachers
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("erro gravar no arquivo")
        return res.redirect(`/teachers`)
    })

}
exports.index = function(req, res) {
    const teachers = []
    for (i in data.teachers) {
        const teacher = {
            ...data.teachers[i],
            areas: data.teachers[i].areas.split(",")
        }
        teachers.push(teacher)
    }
    return res.render("teachers/index", { teachers })
}