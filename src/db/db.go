package db

import (
	"log"
	"os"
	"time"

	"github.com/garciamendes/notes/src/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Init() *gorm.DB {
	DATABASE_URL := os.Getenv("DATABASE_URL")

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info, // mantém os logs visíveis
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
			ParameterizedQueries:      true, // OCULTA OS VALORES!
		},
	)

	var err error
	DB, err := gorm.Open(postgres.Open(DATABASE_URL), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		log.Fatal("Error connect DB: ", err)
	}

	err = DB.AutoMigrate(&models.User{}, &models.Note{})

	if err != nil {
		log.Fatal("Error run migrations: ", err)
	}

	return DB
}
