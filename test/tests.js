import { server } from "../server.js"
import { use, expect } from 'chai'
import chaiHttp from "chai-http"
import fs from 'fs'

const chai = use(chaiHttp)

describe("Test Suite for GET /ids", () => {
    after(() => {
        server.close()
    });

    it("Should return 200 with a UUID string", (done) => {
        chai.request(server).get('/ids').end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            done()
        })
    })
})

describe("Test Suite for GET /users", () => {
    after(() => {
        server.close()
    });

    it("Should return 404 from a non-existant user", (done) => {
        chai.request(server).get('/users?id=9999').end((err, res) => {
            expect(res).to.have.status(404)
            expect(res.body).to.be.eql("User not found")
            done()
        })
    })

    it("Should return all users with status 200 from a wildcard id", (done) => {
        chai.request(server).get('/users?id=*').end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('array')
            done()
        })
    })

    it("Should return a specific user with status 200 from a specified id", (done) => {
        const userData = {
            id: '111',
            name: "Testy Tester",
            email: "test1234@testDomain.net"
        }
        addUserToDbHelper(userData)

        chai.request(server).get('/users?id=111').end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body.id).to.eql('111')
            expect(res.body.name).to.eql('Testy Tester')
            expect(res.body.email).to.eql('test1234@testDomain.net')
            expect(res.body).to.be.eql(userData)
            removeLastUserFromDbHelper()
            done()
        })
    })
})

describe("Test Suite for POST /users", () => {
    after(() => {
        server.close()
    });
    it("Should return either 201 or 500 from a specified user", (done) => {
        const testUser = {
            id: '111',
            name: "Testy Tester",
            email: "test1234@testDomain.net"
        }
        chai.request(server).post('/users').send(testUser).end((err, res) => {
            const status = res.status
            expect(res.status).to.be.oneOf([201, 500])
            if (status === 201) {
                expect(res.body).to.be.eql("Resource created successfully")
                removeLastUserFromDbHelper()
            }
            done()
        })
    })
})

const addUserToDbHelper = (user) => {
    // Pseudo mocking data helper
    const data = JSON.parse(fs.readFileSync('users.json', { encoding: 'utf8' }))
    data.push(user)
    fs.writeFileSync('users.json', JSON.stringify(data), 'utf8')
}

const removeLastUserFromDbHelper = () => {
    // Clean up the mocked data
    const data = JSON.parse(fs.readFileSync('users.json', { encoding: 'utf8' }))
    data.pop()
    fs.writeFileSync('users.json', JSON.stringify(data), 'utf8')
}
