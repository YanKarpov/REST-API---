const request = require("supertest");
const app = require("../app");

describe("POST /notes", () => {
  it("Должен создать новую заметку", async () => {
    const res = await request(app)
      .post("/notes")
      .send({ title: "Test Note", content: "This is a test note" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toEqual("Test Note");
    expect(res.body.content).toEqual("This is a test note");
  });

  it("Должен вернуть 400 для отсутствующих title или content", async () => {
    const res = await request(app).post("/notes").send({ title: "", content: "" });
    expect(res.statusCode).toEqual(400); // Отсутствие обязательных полей
    expect(res.body.message).toContain("Требуются название и содержимое заметки");
  });
});

describe("GET /notes", () => {
  it("Должен вернуть все заметки", async () => {
    const res = await request(app).get("/notes");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0); // Проверка, что заметки не пусты
  });

  it("Должен вернуть заметку по названию", async () => {
    const note = { title: "Searchable Note", content: "This is a searchable note" };
    const createRes = await request(app).post("/notes").send(note);
    const title = createRes.body.title;

    const searchRes = await request(app).get(`/notes/read/${title}`);
    expect(searchRes.statusCode).toEqual(200);
    expect(searchRes.body.title).toEqual(title);
    expect(searchRes.body.content).toEqual("This is a searchable note");
  });

  it("Должен вернуть 404 для несуществующей заметки по названию", async () => {
    const res = await request(app).get("/notes/read/Nonexistent Title");
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toContain("Заметка с названием");
  });
});

describe("DELETE /notes", () => {
  it("Должен удалить заметку", async () => {
    const note = { title: "To be deleted", content: "Temporary note" };
    const createRes = await request(app).post("/notes").send(note);
    const noteId = createRes.body.id;

    const deleteRes = await request(app).delete(`/notes/${noteId}`);
    expect(deleteRes.statusCode).toEqual(204);
  });

  it("Должен вернуть 409 для удаления несуществующей заметки", async () => {
    const res = await request(app).delete("/notes/nonexistent-id");
    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toContain("Заметка с id");
  });
});

describe("PUT /notes", () => {
  it("Должен обновить существующую заметку", async () => {
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

  it("Должен вернуть 409 для обновления несуществующей заметки", async () => {
    const res = await request(app).put("/notes/nonexistent-id").send({ title: "New Title", content: "New Content" });
    expect(res.statusCode).toEqual(409); // Для несуществующей заметки
    expect(res.body.message).toContain("Заметка с id");
  });
});
