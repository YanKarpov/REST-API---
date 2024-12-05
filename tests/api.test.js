const request = require("supertest");
const app = require("../app"); 

describe("Notes API", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "Test Note", content: "This is a test note" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should fetch all notes", async () => {
    const res = await request(app).get("/notes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should delete a note", async () => {
    const note = { title: "To be deleted", content: "Temporary note" };
    const createRes = await request(app).post("/notes").send(note);
    const noteId = createRes.body.id;

    const deleteRes = await request(app).delete(`/notes/${noteId}`);
    expect(deleteRes.statusCode).toEqual(204);
  });
});
