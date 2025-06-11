package db

import (
	"log"
	"os"

	"github.com/garciamendes/notes/src/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	DATABASE_URL := os.Getenv("DATABASE_URL")

	var err error
	DB, err := gorm.Open(postgres.Open(DATABASE_URL), &gorm.Config{})

	if err != nil {
		log.Fatal("Error connect DB: ", err)
	}

	err = DB.AutoMigrate(&models.User{}, &models.Note{})

	if err != nil {
		log.Fatal("Error run migrations: ", err)
	}

	return DB
}
