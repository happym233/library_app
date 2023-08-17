package com.happym.libraryapp.dao;

import com.happym.libraryapp.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

}
