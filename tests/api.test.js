const request = require("supertest");
const app = require("../app");

describe("POST /notes", () => {
  it("should create a new note", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "Test Note", content: "This is a test note" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toEqual("Test Note");
    expect(res.body.content).toEqual("This is a test note");
  });

  it("should return 400 for missing title or content", async () => {
    const res = await request(app).post("/notes").send({ title: "", content: "" });
    expect(res.statusCode).toEqual(400); // Отсутствие обязательных полей
    expect(res.body.message).toContain("Title and content are required");
  });
});

describe("GET /notes", () => {
  it("should fetch all notes", async () => {
    const res = await request(app).get("/notes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0); // Проверка, что заметки не пусты
  });

  it("should fetch a note by title", async () => {
    const note = { title: "Searchable Note", content: "This is a searchable note" };
    const createRes = await request(app).post("/notes").send(note);
    const title = createRes.body.title;

    const searchRes = await request(app).get(`/notes/read/${title}`);
    expect(searchRes.statusCode).toEqual(200);
    expect(searchRes.body.title).toEqual(title);
    expect(searchRes.body.content).toEqual("This is a searchable note");
  });

  it("should return 404 for non-existent note by title", async () => {
    const res = await request(app).get("/notes/read/Nonexistent Title");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toContain("Note with title");
  });
});

describe("DELETE /notes", () => {
  it("should delete a note", async () => {
    const note = { title: "To be deleted", content: "Temporary note" };
    const createRes = await request(app).post("/notes").send(note);
    const noteId = createRes.body.id;

    const deleteRes = await request(app).delete(`/notes/${noteId}`);
    expect(deleteRes.statusCode).toEqual(204);
  });

  it("should return 409 for deleting a non-existent note", async () => {
    const res = await request(app).delete("/notes/nonexistent-id");
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toContain("Note with id");
  });
});

describe("PUT /notes", () => {
  it("should update an existing note", async () => {
    const note = { title: "Original Title", content: "Original Content" };
    const createRes = await request(app).post("/notes").send(note);
    const noteId = createRes.body.id;

    // Обновление заметки
    const updatedNote = { title: "Updated Title", content: "Updated Content" };
    const updateRes = await request(app).put(`/notes/${noteId}`).send(updatedNote);
    expect(updateRes.statusCode).toEqual(204); // Успешное обновление

    // Проверка обновления
    const getRes = await request(app).get(`/notes/${noteId}`);
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body.title).toEqual("Updated Title");
    expect(getRes.body.content).toEqual("Updated Content");
  });

  it("should return 409 for updating a non-existent note", async () => {
    const res = await request(app).put("/notes/nonexistent-id").send({ title: "New Title", content: "New Content" });
    expect(res.statusCode).toEqual(409); // Для несуществующей заметки
    expect(res.body.message).toContain("Note with id");
  });
});
