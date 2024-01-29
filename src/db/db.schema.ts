import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const caleg = sqliteTable("caleg", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  partai: text("partai"),
  dapil: text("dapil"),
  noUrut: text("no_urut"),
  photoUrl: text("photo_url"),
  name: text("name"),
  gender: text("gender"),
  birthPlace: text("birth_place"),
  profileId: text("profile_id"),
  birthDate: text("birth_date"),
  maritalStatus: text("marital_status"),
  religion: text("religion"),
  disabilityStatus: text("disability_status"),
  age: integer("age"),
  address: text("address"),
  address_rt: text("address_rt"),
  address_rw: text("address_rw"),
  address_province: text("address_province"),
  address_city: text("address_city"),
  address_kecamatan: text("address_kecamatan"),
  address_kelurahan: text("address_kelurahan"),
  jobStatus: text("job_status"),
  /** array */
  job: text("job", { mode: "json" }).$type<
    {
      companyName: string;
      position: string;
      yearStart: string;
      yearEnd: string;
    }[]
  >(),
  education: text("education", { mode: "json" }).$type<
    {
      level: "SD" | "SMP" | "SMA" | "D1" | "D2" | "D3" | "D4" | "S1" | "S2" | "S3";
      institutionName: string;
      yearStart: string;
      yearEnd: string;
    }[]
  >(),
  courses: text("courses", { mode: "json" }).$type<
    {
      courseName: string;
      institutionName: string;
      yearStart: string;
      yearEnd: string;
    }[]
  >(),
  organization: text("organization", { mode: "json" }).$type<
    {
      organizationName: string;
      position: string;
      yearStart: string;
      yearEnd: string;
    }[]
  >(),
  awards: text("awards", { mode: "json" }).$type<
    {
      awardName: string;
      institutionName: string;
      year: string;
    }[]
  >(),
  program: text("program"),
  lawStatus: text("law_status"),
});
