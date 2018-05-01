package com.bmu.pronostics.cucumber.stepdefs;

import com.bmu.pronostics.PronosticsApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = PronosticsApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
