
import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Play, Check, Edit2, Copy, Save } from "lucide-react";
import { toast } from "sonner";
import './SqlEditor.css';

interface SqlEditorProps {
  initialSql: string;
  onSqlChange?: (sql: string) => void;
}

const SqlEditor: React.FC<SqlEditorProps> = ({ initialSql, onSqlChange }) => {
  const [sql, setSql] = useState<string>(initialSql);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message?: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSqlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSql(e.target.value);
    if (onSqlChange) {
      onSqlChange(e.target.value);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    toast.success("SQL copied to clipboard");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    // Focus textarea when entering edit mode
    if (!isEditing && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("SQL saved");
  };

  const validateSql = () => {
    // This is a simple validation - in a real app, you would send this to a backend
    let valid = true;
    let message = "SQL is valid";

    // Simple validation for demonstration
    const errors = [];
    
    // Check for basic SQL syntax
    if (!sql.toLowerCase().includes('select') && 
        !sql.toLowerCase().includes('create') && 
        !sql.toLowerCase().includes('insert') && 
        !sql.toLowerCase().includes('update') && 
        !sql.toLowerCase().includes('delete')) {
      errors.push("No SQL keyword detected (SELECT, CREATE, INSERT, UPDATE, DELETE)");
    }
    
    // Check for unbalanced parentheses
    const openParens = (sql.match(/\(/g) || []).length;
    const closeParens = (sql.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push("Unbalanced parentheses");
    }
    
    // Check for semicolons at the end of statements
    if (!sql.trim().endsWith(';')) {
      errors.push("SQL statement should end with a semicolon");
    }

    if (errors.length > 0) {
      valid = false;
      message = errors.join(". ");
    }

    setValidationResult({ valid, message });
    toast[valid ? "success" : "error"](message);
  };

  const executeSql = () => {
    // In a real application, this would connect to a database and execute the SQL
    toast.info("SQL execution simulated. In a real app, this would connect to a database.");
  };

  return (
    <div className="sql-editor">
      <div className="sql-editor-toolbar">
        <h3>SQL Editor</h3>
        <div className="sql-editor-actions">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSave}
              >
                <Save className="mr-1" size={16} /> Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleEdit}
              >
                <Edit2 className="mr-1" size={16} /> Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={validateSql}
              >
                <Check className="mr-1" size={16} /> Validate
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={executeSql}
              >
                <Play className="mr-1" size={16} /> Run
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
              >
                <Copy className="mr-1" size={16} /> Copy
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="sql-editor-content">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={sql}
            onChange={handleSqlChange}
            className="sql-editor-textarea"
            placeholder="Enter SQL query..."
            rows={10}
          />
        ) : (
          <pre className="sql-code">{sql}</pre>
        )}
      </div>
      
      {validationResult && (
        <div className={`sql-validation-result ${validationResult.valid ? 'valid' : 'invalid'}`}>
          <p>{validationResult.message}</p>
        </div>
      )}
    </div>
  );
};

export default SqlEditor;
