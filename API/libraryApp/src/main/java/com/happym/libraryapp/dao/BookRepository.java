package com.happym.libraryapp.dao;

import com.happym.libraryapp.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.RequestParam;

public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable);

    @Query("select b from Book b where (:title is null or b.title like %:title%) and (:category is null or b.category=:category)")
    Page<Book> findByTitleCategory(@RequestParam("title") String title, @RequestParam("category") String category,
                                   Pageable pageable);
}
