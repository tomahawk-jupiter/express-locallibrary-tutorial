const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author doesn't have both names
  // We want to make sure we handle the exception by returning an empty string for that case.
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ", " + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  let lifetime_string = "";
  if (this.date_of_birth) {
    lifetime_string = this.date_of_birth.getYear().toString();
  }
  lifetime_string += " - ";
  if (this.date_of_death) {
    lifetime_string += this.date_of_death.getYear();
  }
  return lifetime_string;
});

// Formatted lifetime string
AuthorSchema.virtual("lifespan_formatted").get(function () {
  let lifetime_string = "";
  if (this.date_of_birth) {
    lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    );
  }
  lifetime_string += " - ";
  if (this.date_of_death) {
    lifetime_string += lifetime_string = DateTime.fromJSDate(
      this.date_of_birth
    ).toLocaleString(DateTime.DATE_MED);
  }
  return lifetime_string;
});

AuthorSchema.virtual("date_of_birth_form_format").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

AuthorSchema.virtual("date_of_death_form_format").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
