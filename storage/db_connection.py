#!/usr/bin/python
import psycopg2
from dotenv import load_dotenv
import os

def connect():
    try:
        load_dotenv()
        user = os.getenv('POSTGRES_USER')
        password = os.getenv('POSTGRES_PASSWORD')
        database = os.getenv('POSTGRES_DB')
        print('Connecting to the PostgreSQL database...')
        return psycopg2.connect(database=database, 
                        user=user,
                        password=password, 
                        host="localhost", port="5432")
    except (Exception, psycopg2.DatabaseError) as error:
        raise error


def run_single_query(query='SELECT version()'):
    conn = None
    try:
        conn = connect()
        cur = conn.cursor()
        
        cur.execute(query)

        conn.commit()
        cur.close()
        print('Query successful')


    except (Exception, psycopg2.DatabaseError) as error:
        print('Query Error:')
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

def insert(query, data):
    conn = None
    try:
        conn = connect()
        cur = conn.cursor()
        
        cur.execute(query,data)

        conn.commit()
        cur.close()
        print('Query successful')


    except (Exception, psycopg2.DatabaseError) as error:
        print('Query Error:')
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


def select_all(query):
    conn = None
    try:
        conn = connect()
        cur = conn.cursor()
        
        cur.execute(query)

        result = cur.fetchall()
        cur.close()
        print('Query successful')
        return result

    except (Exception, psycopg2.DatabaseError) as error:
        print('Query Error:')
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')
            

if __name__ == '__main__':
    result = run_single_query()
    print(result)