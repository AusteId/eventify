package lt.techin.eventify.validation;

import lt.techin.eventify.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException e) {
    Map<String, String> errors = new HashMap<>();

    e.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(),
            error.getDefaultMessage())
    );

    e.getBindingResult().getGlobalErrors().forEach(error ->
            errors.put(error.getObjectName() + "_global", error.getDefaultMessage())
    );

    return ResponseEntity.badRequest().body(errors);
  }

  @ExceptionHandler(EmailAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UsernameAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleUsernameAlreadyExists(UsernameAlreadyExistsException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleUserDoesNotExist(UsernameNotFoundException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<Map<String, String>> handleUserDoesNotExist(InvalidCredentialsException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(AlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleAlreadyExists(AlreadyExistsException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(EventNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleEventNotFound(EventNotFoundException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(CategoryNotFoundException.class)
  public ResponseEntity<Map<String, String>> handleCategoryNotFound(CategoryNotFoundException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<Map<String, String>> handleUnauthorized(ForbiddenException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.FORBIDDEN);
  }

  @ExceptionHandler(AlreadyRegisterException.class)
  public ResponseEntity<Map<String, String>> handleAlreadyRegister(AlreadyRegisterException e) {
    return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.CONFLICT);
  }

}
