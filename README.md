# Bukankpu

Creating better website for KPU's caleg data and providing learning materials for those interested in web performance optimization. With the large amount of data obtained from KPU, we can learn how to handle "not that big data" 260.000+ caleg and how to keep it as high-performing websites.

## Challenges

- [ ] Get all caleg data from KPU
- [ ] Create a high-performing website that can handle 260.000+ caleg data

## Overview

Bukankpu is a tool for getting and showing election data from the Indonesian General Elections Commission (Komisi Pemilihan Umum, KPU) website [infopemilu.kpu.go.id](https://infopemilu.kpu.go.id/). It makes using this data easier and faster.

## Scopes

1. **Data Crawling:** Automates the process of extracting election data from the KPU website, ensuring accuracy and up-to-date information.
2. **User-Friendly Filtering:** Easy-to-use filters for sorting and analyzing data according to specific needs and criteria.
3. **Performance Optimized:** Designed for fast and efficient data handling, even with large datasets.
   - Less loading spinner
   - Less server request
   - Image optimization
   - Static site when possible

## Development Notes

### Image Compression

- [x] Scan data that doesnt have `compressedPhotoUrl`/`compressed_photo_url` on sqlite db
- [x] Compress image using sharp
- [x] Upload to R2 bucket and update `compressedPhotoUrl`/`compressed_photo_url` on sqlite db

#### Steps

- Create bucket in R2 `wrangler r2 bucket create bukankpu`
- Create `accessKeyId`, `secretAccessKey`, get `endpoint` from R2 dashboard
- TBD
