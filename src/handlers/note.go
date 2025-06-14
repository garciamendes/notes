package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/garciamendes/notes/src/middlewares"
	"github.com/garciamendes/notes/src/models"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type NoteHandler struct {
	DB *gorm.DB
}

func (h *Handler) Note() *NoteHandler {
	return &NoteHandler{DB: h.DB}
}

const pageSize int = 20

func (noteHandler NoteHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middlewares.UserIDKey).(string)

	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	db := noteHandler.DB.Model(&models.Note{}).Where("user_id = ?", userID)

	search := r.URL.Query().Get("search")
	if search != "" {
		searchTerm := "%" + search + "%"
		db = db.Where("title ILIKE ?", searchTerm)
	}

	page := 1
	if p, err := strconv.Atoi(r.URL.Query().Get("page")); err == nil && p > 0 {
		page = p
	}

	offset := (page - 1) * pageSize

	var total int64
	db.Count(&total)

	var notes []Notes
	if err := db.Offset(offset).Limit(pageSize).Find(&notes).Error; err != nil {
		http.Error(w, "System Error", http.StatusInternalServerError)
		return
	}

	totalPages := int((total + int64(pageSize) - 1) / int64(pageSize))
	resp := PaginationNotes{
		Total:     total,
		Page:      page,
		TotalPage: totalPages,
		Notes:     notes,
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func (noteHandler NoteHandler) Get(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	noteID := vars["id"]

	var note NotesDetail
	if err := noteHandler.DB.Model(&models.Note{}).Where("id = ?", noteID).First(&note).Error; err != nil {
		http.Error(w, "Note not found", http.StatusNotFound)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(note)
}
